import { Request, Response, NextFunction, RequestHandler } from "express";
import { IUserInteractor } from "../providers/interface/user/iUserInterator";
import { ResponseStatus } from "../utils/statusCodes";
import { isValidEmail } from "../utils/validEmails";
import { isValidPassword } from "../utils/validPassword";
import { IJwtPayload } from "../entities/user";
import { IUser } from "../entities/user"; // Adjust the path to your IUser interface
import { IProductInteractor } from "../providers/interface/product/iProductInteractor";
import { IBrandInteractor } from "../providers/interface/brand/iBrandInteractor";
// import { log } from "console";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export class brandController {
  private _interactor: IBrandInteractor;

  constructor(interactor: IBrandInteractor) {
    this._interactor = interactor;
  }

  createBrand: RequestHandler = async (
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

      if(!req.body) {
        res.status(ResponseStatus.BadRequest).json({
          message: "Request body is required",
        });
        return next();
      }

      const { brandname, description, categories, logo } = req.body;
      const userId = req.user?._id; // Assuming you have userId in the request

      if (!brandname || !description || !categories || !logo) {
        res.status(ResponseStatus.BadRequest).json({
          message: "All fields are required",
        });
        return next();
      }

      const brand = await this._interactor.createBrand(
        brandname,
        description,
        logo,
        categories,
        userId as string
      );
      res.status(ResponseStatus.Created).json(brand);
      return next();
    } catch (error) {
      console.error("Error creating brand:", error);
      res.status(ResponseStatus.BadRequest).json({
        message: "Error creating brand",
      });
      return next();
    }
  };
  getAllBrands: RequestHandler = async (
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

      const brands = await this._interactor.getAllBrands();
      res.status(ResponseStatus.OK).json(brands);
      return next();
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(ResponseStatus.BadRequest).json({
        message: "Error fetching brands",
      });
      return next();
    }
  };
}
