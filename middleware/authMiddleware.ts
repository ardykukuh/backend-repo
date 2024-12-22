import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY!; 
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return; // Explicit return to stop further execution
  }

  try {
    verify(token, secretKey); // Replace with your secret key
    next(); // Token is valid, proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ error: "Unauthorized: Invalid token" });
  }
};


