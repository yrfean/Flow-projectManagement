import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import dotenv from "dotenv";
dotenv.config();

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);

  if (!authHeader) {
    res.status(401).json({ message: "invalid token format" });
    return;
  }

  let token = authHeader.split(" ")[1];

  try {
    // console.log(token);
    const verified = verifyToken(token);
    // console.log("verified:", verified);
    if (!verified) {
      res.status(401).json({ message: "invalid token" });
      return;
    }
    req.body = verified;
    // console.log(verified);
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "inter server error in auth" });
  }
};
