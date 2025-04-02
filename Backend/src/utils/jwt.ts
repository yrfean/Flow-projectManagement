import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { decode } from "punycode";
dotenv.config();

const SECRET_KEY: string = process.env.SECRET_KEY || "default-secret-key";

export const generateToken = async (email: string): Promise<string> => {
  try {
    if (!email) {
      throw new Error("Email is required for token generation");
    }
    return jwt.sign({ email }, SECRET_KEY);
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
};

export const verifyToken = (token: string): { email: string } => {
  try {
    if (!token) {
      throw new Error("Token is required for verification");
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    // console.log(decoded);
    // console.log("Token verification Successfull");
    return decoded as { email: string };
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid or expired token");
  }
};
