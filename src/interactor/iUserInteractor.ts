import { IJwtPayload, ITempUser, IUser } from "../entities/user";
import { IUserInteractor } from "../providers/interface/user/iUserInterator";
import { IUserRepository } from "../providers/interface/user/iUserRepository";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/nodeMailer";
import { generateRandomString } from "../utils/generateOtp";

export class userInteractor implements IUserInteractor {
  private _repository: IUserRepository;
  private readonly JWT_SECRET = process.env.jwtkey; 

  constructor(repository: IUserRepository) {
    this._repository = repository;
  }

  findTempUser = async (email: string): Promise<ITempUser | null> => {
    return await this._repository.findTempUser(email);
  };
  checkOtp = async (
    email: string,
    value: number
  ): Promise<{ isValidOTP: boolean; isExpired: boolean }> => {
    return await this._repository.checkOtp(email, value);
  };
  tempUser(
    email: string,
    otp: number,
    username: string,
    password: string,
    role: string,
    isBlocked: boolean
  ): Promise<boolean | undefined> {
    return this._repository.tempUser(
      email,
      otp,
      username,
      password,
      role,
      isBlocked
    );
  }

  sendMail = async (
    email: string
  ): Promise<{ message: string; otp: number }> => {
    try {
      const otp = generateRandomString();
      const mail = await sendOtpEmail(email, parseInt(otp));
      return { message: mail, otp: parseInt(otp) };
    } catch (error) {
      console.error("Error in sendmail:", error);
      throw error;
    }
  };

  isAdmin = async (email: string): Promise<{ isAdmin: boolean }> => {
    // Implement the logic here
   return await this._repository.isAdmin(email);
  };

  jwt = async (payload: IJwtPayload): Promise<string> => {
    try {
      const token = jwt.sign(

        { _id:payload._id,email: payload.email, role: payload.role },
        this.JWT_SECRET as string,
        { expiresIn: "2h" }
      );
      return token;
    } catch (error) {
      console.error(error);
      throw new Error("Error generating JWT");
    }
  };

  checkpass = async (
    email: string,
    password: string
  ): Promise<boolean | undefined> => {
    try {
      return await this._repository.checkpass(email, password);
    } catch (error) {
      console.error(error);
      throw new Error("Error checking password");
    }
  };

  findUser = async (email: string): Promise<IUser | null> => {
    try {
      return await this._repository.findUser(email);
    } catch (error) {
      console.error(error);
      throw new Error("Error logging in");
    }
  };

  signup = async (
    username: string,
    email: string,
    password: string,
    role: string,
    isBlocked: boolean
  ): Promise<IUser> => {
    try {
      return await this._repository.signup(
        username,
        email,
        password,
        role,
        isBlocked
      );
    } catch (error) {
      console.error(error);
      throw new Error("Error signing up");
    }
  };
}
