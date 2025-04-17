export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    role: string
    isBlocked: boolean;
    profilePicture?: string;
    blockedUser?: string[];
  }
  
  export interface ITempUser extends IUser {
    otp: number;
  }
  
  export interface IJwtPayload {
    _id: string;
    email: string;
    role: string
    isBlocked: boolean;
    iat?: number; 
    exp?: number; 
  }
  
  