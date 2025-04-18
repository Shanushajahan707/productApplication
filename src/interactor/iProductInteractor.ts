
import { iProduct } from "../entities/product";
import { IProductInteractor } from "../providers/interface/product/iProductInteractor";
import { IProductRepository } from "../providers/interface/product/iProductRepository";

export class productInteractor implements IProductInteractor {
  private _repository: IProductRepository;
  private readonly JWT_SECRET = process.env.jwtkey;

  constructor(repository: IProductRepository) {
    this._repository = repository;
  }

  getAllProducts = async (userId: string, filterData: { brand?: string; category?: string; sortBy?: string }): Promise<{ message: string; status: string; products: iProduct[] }> => {
    try {
      const result = await this._repository.getAllProducts(userId,filterData);
      return {
        message: result.message,
        status: result.status.toString(),
        products: result.products as iProduct[], 
      };
    } catch (error: any) {
      throw new Error(error.message || "An error occurred while fetching products.");
    }
  };


  async createProduct(productName: string, description: string, categories: string, price: number, userId: string,brandId:string): Promise<{ message: string; status: string; }> {
    try {
      const result = await this._repository.createProduct(
        productName,
        description,
        categories,
        price,
        userId,
        brandId
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
  
}
