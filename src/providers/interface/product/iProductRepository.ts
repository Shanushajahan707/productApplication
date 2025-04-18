import { iProduct } from "../../../entities/product";
import { IJwtPayload, ITempUser, IUser } from "../../../entities/user";

export interface IProductRepository {
  createProduct: (
    productName: string,
    description: string,
    categories: string,
    price: number,
    userId: string,
    brandId: string
  ) => Promise<{ message: string; status: string }>;
  getAllProducts: (
    userId: string,
    filter: {
      brand?: string;
      category?: string;
      sortBy?: string;
    }
  ) => Promise<{ message: string; status: string; products: iProduct[] }>;
}
