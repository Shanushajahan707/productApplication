import { Request, Response, NextFunction, RequestHandler } from "express";
import { IUserInteractor } from "../providers/interface/user/iUserInterator";
import { ResponseStatus } from "../utils/statusCodes";
import { isValidEmail } from "../utils/validEmails";
import { isValidPassword } from "../utils/validPassword";
import { IJwtPayload } from "../entities/user";

export class userController {
  private _interactor: IUserInteractor;

  constructor(interactor: IUserInteractor) {
    this._interactor = interactor;
  }

  login: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log(req.body);
      if (!req.body) {
        res
          .status(ResponseStatus.BadRequest)
          .json({ message: "No User Data Provided" });
        return;
      }

      const user = {
        email: req.body.email ? req.body.email.trim() : null,
        password: req.body.password ? req.body.password.trim() : null,
      };

      if (!user.password || !user.email) {
        res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Password or email is required" });
        return;
      }

      if (!isValidEmail(user.email)) {
        res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Invalid email format" });
        return;
      }

      const userExist = await this._interactor.findUser(user.email);

      if (userExist) {
        const check = await this._interactor.checkpass(
          user.email,
          user.password
        );

        if (!check) {
          res
            .status(ResponseStatus.BadRequest)
            .json({ message: "Password Doesn't Match" });
          return;
        }

        const isAdmin = await this._interactor.isAdmin(user.email);

        if (userExist.isBlocked) {
          res
            .status(ResponseStatus.BadRequest)
            .json({ message: "Account Blocked" });
          return;
        }

        const payload: IJwtPayload = {
          _id: userExist._id as string,
          email: userExist.email,
          role: userExist.role,
          isBlocked: userExist.isBlocked,
        };
        const refreshToken = await this._interactor.refreshToken(payload);


        const token = await this._interactor.jwt(payload);
        res
          .status(ResponseStatus.Accepted)
          .json({ message: "Success Login", accessToken:token,refreshToken:refreshToken, isAdmin });
      } else {
        res
          .status(ResponseStatus.BadRequest)
          .json({ message: "User not found" });
      }
    } catch (error) {
      next(error);
    }
  };

  signup: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log(req.body);
      if (!req.body) {
        res
          .status(ResponseStatus.BadRequest)
          .json({ message: "No User Data Provided" });
        return;
      }

      const user = {
        username: req.body.username ? req.body.username.trim() : null,
        email: req.body.email ? req.body.email.trim() : null,
        password: req.body.password ? req.body.password.trim() : null,
        role: req.body.role ? req.body.role.trim() : null,
        isBlocked: req.body.isBlocked ? req.body.isBlocked : false,
      };

      if (!["admin", "recruiter", "job_seeker"].includes(user.role)) {
        res.status(ResponseStatus.BadRequest).json({ message: "Invalid role" });
        return;
      }

      if (!user.username || !user.password || !user.email || !user.role) {
        res.status(ResponseStatus.BadRequest).json({
          message: "Username, password, email, and role are required",
        });
        return;
      }

      if (!isValidEmail(user.email)) {
        res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Invalid email format" });
        return;
      }

      if (!isValidPassword(user.password)) {
        res.status(ResponseStatus.BadRequest).json({
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        });
        return;
      }
      const userExist = await this._interactor.findUser(user.email);
      console.log("user exist", userExist);
      if(userExist) {
        res.status(ResponseStatus.BadRequest).json({ message: "User already exists" }); 
        return
      }

      const mailsent = await this._interactor.sendMail(user.email);
      console.log("sent ", mailsent);

      if (mailsent) {
        const tempuser = await this._interactor.tempUser(
          user.email,
          mailsent.otp as number,
          user.username,
          user.password,
          user.role,
          user.isBlocked
        );

        if (tempuser) {
          console.log("temp user", tempuser);
          res
            .status(ResponseStatus.OK)
            .json({ message: `Check ${user.email}`, email: user.email });
          return;
        }
      }
    } catch (error) {
      next(error);
    }
  };

  onCheckOtp: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.body || !req.body.email || !req.body.otp) {
        res
          .status(ResponseStatus.BadRequest)
          .json({ message: "Enter the OTP properly" });
        return;
      }

      console.log('req body',req.body);

      const { email, otp } = req.body;
      const otpCheckResult = await this._interactor.checkOtp(email, otp);

      console.log("full otp result", otpCheckResult);

      if (otpCheckResult.isExpired) {
        res.status(ResponseStatus.BadRequest).json({ message: "OTP Expired" });
        return;
      }

      if (!otpCheckResult.isValidOTP) {
        res.status(ResponseStatus.BadRequest).json({ message: "Invalid OTP" });
        return;
      }

      const tempUser = await this._interactor.findTempUser(email);
      console.log("temp user", tempUser);

      if (tempUser) {
        const isUserRegistered = await this._interactor.signup(
          tempUser.name,
          tempUser.email,
          tempUser.password,
          tempUser.role,
          tempUser.isBlocked
        );

        if (isUserRegistered) {
          res
            .status(ResponseStatus.Created)
            .json({ message: "User Data registered" });
          return;
        } else {
          res
            .status(ResponseStatus.BadRequest)
            .json({ message: "Error while inserting user data" });
          return;
        }
      }

      res.status(ResponseStatus.BadRequest).json({ message: "User not found" });
    } catch (error) {
      next(error);
    }
  };
  refreshToken: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res
          .status(ResponseStatus.BadRequest)
          .json({ error: "Refresh token is missing" });
        return;
      }

      const isTokenValid = await this._interactor.verifyRefreshToken(
        refreshToken
      );
      if (!isTokenValid) {
        res
          .status(ResponseStatus.BadRequest)
          .json({ error: "Invalid refresh token" });
        return;
      }

      const newAccessToken = await this._interactor.generateNewToken(
        refreshToken
      );
      if (!newAccessToken) {
        res
          .status(ResponseStatus.BadRequest)
          .json({ error: "Error generating token" });
        return;
      }

      console.log("New token created:", newAccessToken);
      res.status(ResponseStatus.Accepted).json({
        accessToken: newAccessToken,
        message: "Token refreshed",
      });
    } catch (error) {
      next(error);
    }
  };


}