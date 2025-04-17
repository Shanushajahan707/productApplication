import { ITempUser, IUser } from "../entities/user";
import { otpModel } from "../model/otpSession";
import UserModel from "../model/userModel";
import { IUserRepository } from "../providers/interface/user/iUserRepository";
import bcrypt from "bcryptjs";

export class userRepository implements IUserRepository {
  findTempUser = async (email: string): Promise<ITempUser | null> => {
    try {
      const tempUser = await otpModel.findOne({ email }).lean();
      return tempUser as ITempUser | null;
    } catch (error) {
      console.error("Error in findTempUser:", error);
      throw new Error("Error finding temporary user");
    }
  };

  checkOtp = async (
    email: string,
    value: number
  ): Promise<{ isValidOTP: boolean; isExpired: boolean }> => {
    try {
      console.log(email, value);

      const otpRecord = await otpModel.findOne({ email: email });
      console.log(otpRecord);

      if (otpRecord) {
        const expirationTime =
          new Date(otpRecord.createdAt as Date).getTime() + 60 * 1000;
        const isExpired = new Date().getTime() > expirationTime;
        const isValidOTP = otpRecord.otp == value && !isExpired;

        console.log(`Current Time: ${new Date()}`);
        console.log(`OTP Created At: ${otpRecord.createdAt}`);
        console.log(`Expiration Time: ${new Date(expirationTime)}`);
        console.log(`isExpired: ${isExpired}, isValidOTP: ${isValidOTP}`);

        return { isValidOTP, isExpired };
      }

      return { isValidOTP: false, isExpired: true };
    } catch (error) {
      console.error("Error in checkOtp:", error);
      throw new Error("Error checking OTP");
    }
  };

  tempUser = async (
    email: string,
    otp: number,
    username: string,
    password: string,
    role: string,
    isBlocked: boolean
  ): Promise<boolean | undefined> => {
    const newOtp = new otpModel({
      email: email,
      otp: otp,
      password: password,
      role: role,
      isBlocked: isBlocked,
      name: username,
      createdAt: new Date(),
    });

    const tempuser = await newOtp.save();
    if (tempuser) return true;
  };

  isAdmin = async (email: string): Promise<{ isAdmin: boolean }> => {
    try {
      const user = await UserModel.findOne({ email }).lean();
      if (!user) {
        return { isAdmin: false };
      }
      return { isAdmin: user.role === "admin" };
    } catch (error) {
      console.error(error);
      throw new Error("Error checking if user is admin");
    }
  };

  checkpass = async (
    email: string,
    password: string
  ): Promise<boolean | undefined> => {
    try {
      const user = await UserModel.findOne({ email }).lean();
      if (!user) return undefined;
      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch;
    } catch (error) {
      console.error(error);
      throw new Error("Error checking password");
    }
  };

  findUser = async (email: string): Promise<IUser | null> => {
    try {
      const user = await UserModel.findOne({ email }).lean();
      return user as IUser | null;
    } catch (error) {
      console.error(error);
      throw new Error("Error finding user");
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
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        name: username,
        email,
        password: hashedPassword,
        role,
        isBlocked,
      });
      await newUser.save();
      return newUser.toObject() as IUser;
    } catch (error) {
      console.error(error);
      throw new Error("Error signing up");
    }
  };
}
