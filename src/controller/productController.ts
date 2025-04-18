import { Request, Response, NextFunction, RequestHandler } from "express";
import { IUserInteractor } from "../providers/interface/user/iUserInterator";
import { ResponseStatus } from "../utils/statusCodes";
import { isValidEmail } from "../utils/validEmails";
import { isValidPassword } from "../utils/validPassword";
import { IJwtPayload } from "../entities/user";
import { IUser } from "../entities/user"; // Adjust the path to your IUser interface
import { IProductInteractor } from "../providers/interface/product/iProductInteractor";
// import { log } from "console";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export class productController {
  private _interactor: IProductInteractor;

  constructor(interactor: IProductInteractor) {
    this._interactor = interactor;
  }

  createProduct: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const currentUserId = req.user?._id;

      if (!currentUserId) {
        res
          .status(ResponseStatus.Unauthorized)
          .json({ message: "Unauthorized access" });
        return;
      }

      if (!req.body) {
        res.status(ResponseStatus.BadRequest).json({
          message: "Request body is required",
        });
        return next();
      }

      const { productName, description, category, price, brandId } = req.body;
      const userId = req.user?._id;

      if (!productName || !description || !category || !price || !brandId) {
        res.status(ResponseStatus.BadRequest).json({
          message: "All fields are required",
        });
        return next();
      }

      const product = await this._interactor.createProduct(
        productName,
        description,
        category,
        price,
        userId as string,
        brandId
      );

      res.status(ResponseStatus.Created).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(ResponseStatus.BadRequest).json({
        message: "Internal server error",
      });
    }
  };

  getAllProducts: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const currentUserId = req.user?._id;

      if (!currentUserId) {
        res
          .status(ResponseStatus.Unauthorized)
          .json({ message: "Unauthorized access" });
        return;
      }

      const filter = {
        brand: req.query.brand as string,
        category: req.query.category as string,
        sortBy: req.query.sortBy as string,
      };

      const products = await this._interactor.getAllProducts(
        currentUserId as string,
        filter
      );
      res.status(ResponseStatus.OK).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(ResponseStatus.BadRequest).json({
        message: "Internal server error",
      });
    }
  };
}
