import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../entities/user";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const jwtKey = process.env.jwtkey as string;
const refreshKey = process.env.SECRET_LOGIN  as string;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  console.log("header", req.headers); // Debugging line
  
  console.log("Authorization Header:", authHeader); // Debugging line
  console.log("JWT Key:", jwtKey); // Debugging line
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, jwtKey, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        handleRefreshToken(req, res, next);
        return;
      }
      res.status(403).json({ message: "Forbidden: Invalid token" });
      return;
    }

    const payload = decoded as JwtPayload;
    req.user = {
      _id: payload._id,
      name: payload.name || "",
      email: payload.email,
      profilePicture: payload.profilePicture || "",
      role: payload.role || "",
      isBlocked: payload.isBlocked || false,
      blockedUser: payload.blockedUser || [],
      password: payload.password || "",
    };
    next();
  });
};

export const handleRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const refreshToken = req.headers["refresh-token"] as string;
  console.log('refreshtoken', refreshToken); // Debugging line
  
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized: Refresh token missing" });
    return;
  }

  if (!refreshToken || !refreshToken.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = refreshToken.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_LOGIN  as string) as JwtPayload;
    console.log("Decoded refresh token:", decoded); // Debugging line

    const newAccessToken = jwt.sign(
      { _id: decoded._id, name: decoded.name },
      jwtKey,
      { expiresIn: "15m" }
    );

    res.setHeader("x-access-token", newAccessToken);
    req.user = {
      _id: decoded._id,
      name: decoded.name || "",
      email: decoded.email,
      profilePicture: decoded.profilePhoto || "",
      role: decoded.role || "",
      isBlocked: decoded.isBlocked || false,
      blockedUser: decoded.blockedUser || [],
      password: decoded.password || "",
    };
    next();
  } catch (err) {
    res.status(403).json({ message: "Forbidden: Invalid refresh token",err });
  }
};

