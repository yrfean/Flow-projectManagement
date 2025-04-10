import mongoose from "mongoose";

type userType = {
  name: string;
  email: string;
  password: string;
  otp: string | number |undefined;
  phone: string;
  location?: string;
  role: string;
  dp: string;
};

const userSchema = new mongoose.Schema<userType>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    otp: {
      type: String || Number||undefined,
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    role: {
      type: String,
    },
    dp: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<userType>("User", userSchema);
