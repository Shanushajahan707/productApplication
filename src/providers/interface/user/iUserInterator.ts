import { IJwtPayload, ITempUser, IUser } from "../../../entities/user";

export interface IUserInteractor {
  findUser(email: string): Promise<IUser | null>;
  signup(
    username: string,
    email: string,
    password: string,
    role: string,
    isBlocked: boolean
  ): Promise<IUser>;
  checkpass(email: string, password: string): Promise<boolean | undefined>;
  isAdmin(email: string): Promise<{ isAdmin: boolean }>;
  jwt(payload: IJwtPayload): Promise<string>;
  sendMail(email: string): Promise<{ message: string; otp: number }>;
  tempUser(
    email: string,
    otp: number,
    username: string,
    password: string,
    role: string,
    isBlocked: boolean
  ): Promise<boolean | undefined>;
  checkOtp(
    email: string,
    value: number
  ): Promise<{ isValidOTP: boolean; isExpired: boolean }>;
  findTempUser(email: string): Promise<ITempUser | null>;
}
