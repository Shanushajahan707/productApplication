import { IJwtPayload, ITempUser, IUser } from "../../../entities/user";

export interface IUserRepository {
  findUser(email: string): Promise<IUser | null>;
  signup(
    username: string,
    email: string,
    password: string,
    role: string,
    isBlocked: boolean
  ): Promise<IUser>;
  refreshToken(payload: IJwtPayload): Promise<string>;
  verifyRefreshToken(token: string): Promise<boolean>;
  generateNewToken(token: string): Promise<string | null>;
  checkpass(email: string, password: string): Promise<boolean | undefined>;
  isAdmin(email: string): Promise<{ isAdmin: boolean }>;
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
  getUserProfile(userId: string): Promise<IUser | null>;
  updateUserProfile(
    userId: string,
    updatedData: Partial<IUser>
  ): Promise<IUser | null>;
  changePassword(
    userid: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ isChanged: boolean; message: string }>;
  blockUser(
    userId: string,
    blockedUserId: string
  ): Promise<{ message: string; isBlocked: boolean }>;
  unblockUser(
    userId: string,
    blockedUserId: string
  ): Promise<{ message: string; isBlocked: boolean }>;
  // getAllUsers(): Promise<IUser[]>;
  getspecificUser(currentUserId: string, userId: string): Promise<IUser | null>;
  listAllUsers(currentUserId: string): Promise<IUser[]>;
}
