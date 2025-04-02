import mongoose from "mongoose";

type taskType = {
  title: string;
  description: string;
  project: mongoose.Schema.Types.ObjectId;
  assignedBy: mongoose.Schema.Types.ObjectId;
  assignedTo: mongoose.Schema.Types.ObjectId;
  priority: "low" | "medium" | "high" | "urgent";
  status: "to-do" | "in-progress" | "completed";
  dueDate: Date;
};

const taskSchema = new mongoose.Schema<taskType>(
  {
    title: { type: String, required: true },
    description: { type: String },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["to-do", "in-progress", "completed"],
      default: "to-do",
    },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<taskType>("Task", taskSchema);
