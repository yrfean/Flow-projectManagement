import { Request, Response } from "express";
import User from "../Schemas/userSchema";
import { generateToken } from "../utils/jwt";
import { comparePassword, HashPassword } from "../utils/brypt";
import { hash } from "crypto";
import { request } from "http";

// Create User
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, name, role, phone, location } = req.body as {
    email: string;
    password: string;
    name: string;
    role: string;
    phone: string;
    location: string;
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

    const filePath = `http://localhost:3000/public/noProfile.jpeg`;
    //Create and Save the new user
    const newUser = new User({
      email,
      name,
      role,
      password: hashedPassword,
      location,
      phone,
      dp: filePath,
    });
    // console.log(newUser);
    const savedUser = await newUser.save();
    //create token
    const token = await generateToken(email);
    res.status(201).json({
      isSuccess: true,
      token,
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
  let upUser;
  if (req.file?.filename) {
    const filePath = `http://localhost:3000/images/${req.file?.filename}`;
    upUser = await User.findByIdAndUpdate(
      { _id: id },
      { location, phone, email, role, password, name, dp: filePath },
      { new: true, runValidators: true }
    );
  } else {
    upUser = await User.findByIdAndUpdate(
      { _id: id },
      { location, phone, email, role, password, name },
      { new: true, runValidators: true }
    );
  }

  res.status(200).send({ messsage: "updation successful" });
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
      existing,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ isSuccess: false, message: "Internal server error" });
  }
};

import nodemailer from "nodemailer";

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (!existing) throw new Error("No user exists with that email");

    const otp = Math.floor(10000 + Math.random() * 90000);
    existing.otp = otp;
    await existing.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yrfeaan@gmail.com",
        pass: "rxcg qyzu drxj qhzy",
      },
    });

    const mailOptions = {
      from: "yrfeaan@gmail.com",
      to: email,
      subject: otp.toString(),
      text: `Your OTP code is ${otp}. This code will expire in 10 minutes.`,
      html: `<p>Your OTP code is <b>${otp}</b>. This code will expire in 10 minutes.</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in sending OTP", error });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp != parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await HashPassword(password);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
    res.status(200).json({ message: "password updated" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "something wrong in chaning pass:", error });
  }
};
