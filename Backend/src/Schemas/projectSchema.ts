import mongoose from "mongoose";

type projectType = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: Date;
  assignedDate: Date;
  teamLead: mongoose.Schema.Types.ObjectId;
  members: mongoose.Schema.Types.ObjectId[];
  status: "incompleted" | "completed" | "pending";
};

const projectSchema = new mongoose.Schema<projectType>(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    dueDate: { type: Date, required: true },
    assignedDate: { type: Date, default: Date.now },
    teamLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["incompleted", "completed", "pending"],
      default: "incompleted",
    },
  },
  { timestamps: true }
);

export default mongoose.model<projectType>("Project", projectSchema);
