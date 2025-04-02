import mongoose from "mongoose";

type userType = {
  name: string;
  email: string;
  password: string;
  phone: string;
  location?: string;
  role: string;
  dp: string;
};

const userSchema = new mongoose.Schema<userType>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    role: {
      type: String,
      enum: [
        "developer",
        "desginer",
        "ui/ux",
        "frontend developer",
        "backend developer",
        "devops",
        "digital marketer",
      ],
    },
    dp: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<userType>("User", userSchema);
