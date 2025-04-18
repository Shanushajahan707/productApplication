import mongoose, { Types } from "mongoose";
import { IProductRepository } from "../providers/interface/product/iProductRepository";
import { IBrandRepository } from "../providers/interface/brand/iBrandRepository";
import BrandModel from "../model/brandModel";
import { Brand } from "../entities/brand";

export class brandRepository implements IBrandRepository {
  getAllBrands = async (): Promise<{
    message: string;
    status: boolean;
    brands: Brand[];
  }> => {
    try {
      const brands = await BrandModel.find({}).populate(
        "createdBy",
        "name email"
      );
      const mappedBrands: Brand[] = brands.map((brand) => ({
        _id: brand._id.toString(),
        BrandName: brand.brandName,
        description: brand.description,
        BrandLogo: brand.brandLogo,
        categories: brand.categories,
        createdBy: new Types.ObjectId(brand.createdBy._id).toString(),
      }));
      return {
        message: "Brands fetched successfully",
        status: true,
        brands: mappedBrands,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch brands: ${error.message}`);
    }
  };

  createBrand = async (
    brand: string,
    description: string,
    brandLogo: string,
    categories: string[],
    createdBy: string
  ): Promise<{ message: string; status: boolean }> => {
    try {
      const cleanedBrand = brand.trim();
        console.log('parameter',brand,description,brandLogo,categories,createdBy)
      const existingBrand = await BrandModel.findOne({
        brandName: { $regex: `^${cleanedBrand}$`, $options: "i" },
      });

      if (existingBrand) {
        console.log('existingBrand',existingBrand)
        return { message: "Brand already exists", status: false };
      }else{

          const newBrand = new BrandModel({
            brandName: cleanedBrand,
            description: description.trim(),
            brandLogo: brandLogo.trim(),
            categories: categories.map((c) => c.trim()),
            createdBy: new Types.ObjectId(createdBy),
          });
    
          await newBrand.save();
      }


      return { message: "Brand created successfully", status: true };
    } catch (error: any) {
      throw new Error(`Failed to create brand: ${error.message}`);
    }
  };
}
