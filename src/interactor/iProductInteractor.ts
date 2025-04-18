
import { IProductInteractor } from "../providers/interface/product/iProductInteractor";
import { IProductRepository } from "../providers/interface/product/iProductRepository";

export class productInteractor implements IProductInteractor {
  private _repository: IProductRepository;
  private readonly JWT_SECRET = process.env.jwtkey;

  constructor(repository: IProductRepository) {
    this._repository = repository;
  }

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
