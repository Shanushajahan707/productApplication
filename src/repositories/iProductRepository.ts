import mongoose from "mongoose";
import ProductModel from "../model/productModel";
import BrandModel from "../model/brandModel"; //
import { IProductRepository } from "../providers/interface/product/iProductRepository";
import UserModel from "../model/userModel";
import { iProduct } from "../entities/product";

export class productRepository implements IProductRepository {
  getAllProducts = async (
    userId: string,
    filterData: { 
      brand?: string; 
      category?: string; 
      sortBy?: string;
      priceGt?: string;
      priceLt?: string;
      // Add more filters as needed
    }
  ): Promise<{ message: string; status: string; products: iProduct[] }> => {
    try {
      const currentUser = await UserModel.findById(userId);
      const blockedUsers = currentUser?.blockedUser || [];
  
      // Base filter: Exclude products from blocked users
      const filter: any = {
        addedBy: { $nin: blockedUsers }
      };
  
      // Brand filter
      if (filterData.brand) {
        filter.brand = filterData.brand;
      }
  
      // Category filter (using array contains)
      if (filterData.category) {
        filter.categories = filterData.category; // Changed from 'category' to 'categories'
      }
  
      // Price range filter
      if (filterData.priceGt || filterData.priceLt) {
        filter.$or = [];
        if (filterData.priceGt) {
          const price = Number(filterData.priceGt);
          if (!isNaN(price)) filter.$or.push({ price: { $gt: price } });
        }
        if (filterData.priceLt) {
          const price = Number(filterData.priceLt);
          if (!isNaN(price)) filter.$or.push({ price: { $lt: price } });
        }
      }
  
      // Sorting logic
      const sort: any = {};
      if (filterData.sortBy) {
        const [field, order] = filterData.sortBy.split(":");
        if (["price", "productName"].includes(field)) {
          sort[field] = order === "desc" ? -1 : 1;
        }
      }
  
      // Query with population
      const rawProducts = await ProductModel.find(filter)
        .sort(sort)
        .populate("addedBy", "_id")
        .populate("brand", "_id")
        .lean();
  
      // Map products with proper typing
      const products: iProduct[] = rawProducts.map((product: any) => ({
        _id: product._id.toString(),
        productName: product.productName,
        description: product.description,
        price: product.price,
        category: product.categories, // Ensure this is a string
        categories: product.categories, 
        brand: product.brand?._id?.toString() || product.brand.toString(),
        productImage: product.productImage,
        addedBy: product.addedBy?._id?.toString() || product.addedBy.toString(),
      }));
  
      return {
        message: "Products fetched successfully",
        status: "success",
        products,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  };
  


  createProduct = async (
    productName: string,
    description: string,
    category: string,
    price: number,
    userId: string,
    brandId: string
  ): Promise<{ message: string; status: string }> => {
    try {
      // Check if the product already exists
      const existingProduct = await ProductModel.findOne({
        productName: { $regex: `^${productName}$`, $options: "i" },
      });

      if (existingProduct) {
        return { message: "Product already exists", status: "error" };
      }

      // Check if the brand exists
      const brand = await BrandModel.findById(
        new mongoose.Types.ObjectId(brandId)
      );
      if (!brand) {
        return { message: "Brand not found", status: "error" };
      }

      // Validate if the category exists under the brand
      const trimmedCategory = category.trim(); // Trim whitespace from the category
      if (!brand.categories.includes(trimmedCategory)) {
        return {
          message: `Invalid category: ${trimmedCategory}. This category is not associated with the brand.`,
          status: "error",
        };
      }

      // Create a new product
      const newProduct = new ProductModel({
        productName: productName.trim(),
        description: description.trim(),
        category: trimmedCategory, // Use the single validated category
        price,
        addedBy: new mongoose.Types.ObjectId(userId), // Ensure this matches the schema
        brand: new mongoose.Types.ObjectId(brandId), // Ensure this matches the schema
      });

      await newProduct.save();
      return { message: "Product created successfully", status: "success" };
    } catch (error: any) {
      console.error("Error creating product:", error.message);
      throw new Error(`Failed to create product: ${error.message}`);
    }
  };
}
