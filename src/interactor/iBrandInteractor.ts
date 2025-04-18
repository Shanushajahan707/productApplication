
import { Brand } from "../entities/brand";
import { IBrandInteractor } from "../providers/interface/brand/iBrandInteractor";
import { IBrandRepository } from "../providers/interface/brand/iBrandRepository";
import { IProductInteractor } from "../providers/interface/product/iProductInteractor";
import { IProductRepository } from "../providers/interface/product/iProductRepository";

export class brandInteractor implements IBrandInteractor {
  private _repository: IBrandRepository;
  private readonly JWT_SECRET = process.env.jwtkey;

  constructor(repository: IBrandRepository) {
    this._repository = repository;
  }
  getAllBrands = async (): Promise<{ message: string; status: boolean; brands: Brand[] }> => {
    try {
      const result = await this._repository.getAllBrands();
      return result;
    } catch (error: any) {
      throw new Error(error.message || "An error occurred while fetching brands.");
    }
  };
  async createBrand(  brand: string,
    description: string,
    brandLogo: string,
    categories: string[],
    createdBy: string): Promise<{ message: string; status: boolean; }> {
    try {
      const result = await this._repository.createBrand(
        brand,
        description,
        brandLogo,
        categories,
        createdBy);
      return result;
    } catch (error) {
      throw error;
    }
  }

  

}
