import { Request, Response } from "express";
import User from "../Schemas/userSchema";
import { generateToken } from "../utils/jwt";
import { comparePassword, HashPassword } from "../utils/brypt";
import { hash } from "crypto";

// Create User
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, name, role } = req.body as {
    email: string;
    password: string;
    name: string;
    role: string;
  };

  // Validate input
  if (!email || !password || !name) {
    res.status(400).json({
      isSuccess: false,
      message: "Email, password, and role are required",
    });
    return;
  }

  // Check existing user
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(401).json({ Message: "user already exists" });
    return;
  }

  try {
    // Hash the password
    const hashedPassword = await HashPassword(password);

    //Create and Save the new user
    const newUser = new User({
      email,
      name,
      role,
      password: hashedPassword,
    });
    // console.log(newUser);
    const savedUser = await newUser.save();
    res.status(201).json({
      isSuccess: true,
      message: "User created successfully",
      data: savedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ isSuccess: false, message: "Internal server error" });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id);
  const { email, password, location, phone, name, role } = req.body;
  const filePath = `http://localhost:3000/images/${req.file?.filename}`;
  const upUser = await User.findByIdAndUpdate(
    { _id: id },
    { location, phone, email, role, password, name, dp: filePath },
    { new: true, runValidators: true }
  );
  res.status(200).send({ messsage: "updation successful", upUser });
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Get user
export const getUser = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: "there is no such user" });
  }
  res.status(200).json({ message: "got the user", data: user });
};

// get users
export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find({});
  // console.log(users);
  res.status(200).json({ message: "got everyone", data: users });
};

// LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res
      .status(400)
      .json({ isSuccess: false, message: "Email and password are required" });
    return;
  }
  type User = {
    name: string;
    email: string;
    password: string;
    phone: string;
    location?: string;
    dp: string;
    _id?: string;
  };
  try {
    const existing: User | null = await User.findOne({ email });

    if (!existing) {
      res
        .status(401)
        .json({ isSuccess: false, message: "Invalid credentials" });
      return;
    }

    const hashedPassword = existing.password;

    const isPasswordValid = await comparePassword(password, hashedPassword);
    if (!isPasswordValid) {
      res
        .status(401)
        .json({ isSuccess: false, message: "Invalid credentials" });
      return;
    }

    const token = await generateToken(email);
    res.status(200).json({
      isSuccess: true,
      message: "User logged in successfully",
      data: { token, _id: existing._id },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ isSuccess: false, message: "Internal server error" });
  }
};
