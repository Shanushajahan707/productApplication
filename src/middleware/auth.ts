import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

const jwtkey = process.env.JWT_SECRET as string; 

const authMiddleware = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      console.log(req.headers);
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
      }

      const token = authHeader.split(" ")[1];

      jwt.verify(token, jwtkey, (err, decoded) => {
        if (err) {
          res.status(403).json({ message: "Forbidden: Invalid or expired token" });
          return;
        }

        const payload = decoded as JwtPayload; 
        if (!roles.includes(payload.role)) {
          res.status(403).json({ message: "Access denied: Insufficient permissions" });
          return;
        }

        req.user = { id: payload.id, role: payload.role };
        next();
      });
    } catch (error) {
      console.error("Authentication Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

export default authMiddleware;
