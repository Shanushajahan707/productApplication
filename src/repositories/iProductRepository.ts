import mongoose from "mongoose";
import ProductModel from "../model/productModel";
import BrandModel from "../model/brandModel"; //
import { IProductRepository } from "../providers/interface/product/iProductRepository";

export class productRepository implements IProductRepository {
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
