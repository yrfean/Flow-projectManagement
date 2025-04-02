import { responseEncoding } from "axios";
import Task from "../Schemas/taskSchema";
import { Request, Response } from "express";

// Create task
export const createTask = async (req: Request, res: Response) => {
  const {
    title,
    description,
    project,
    assignedBy,
    assignedTo,
    dueDate,
    priority,
    status,
  } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      project,
      assignedBy,
      assignedTo,
      dueDate,
      priority,
      status,
    });
    await newTask.save();
    res.status(200).json({ message: "new task created", data: newTask });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server errror nyaa");
  }
};

// Get tasks by user

export const getTasksUser = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const tasks = await Task.find({ assignedTo: _id });

    if (tasks.length === 0) {
      res.status(200).json({ message: "No tasks assigned to this user" });
      return;
    }

    res
      .status(200)
      .json({ message: "Tasks retrieved successfully", data: tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get tasks by Project
export const getTasksProject = async (req: Request, res: Response) => {
  const { _id } = req.params; //project id

  const tasks = await Task.find({ project: _id });
  if (tasks.length === 0) {
    res.status(200).json({ message: "No tasks assigned to this project" });
    return;
  }
  res.status(200).json({ message: "got tasks of that project", data: tasks });
};

// Get all tasks
export const getAllTasks = async (req: Request, res: Response) => {
  const tasks = await Task.find({});

  res.status(200).json({ message: "got tasks of that project", data: tasks });
};

// Update task
export const updateTask = async (req: Request, res: Response) => {
  const { _id } = req.params;
  //   console.log(_id);
  const {
    title,
    description,
    project,
    assignedBy,
    assignedTo,
    dueDate,
    priority,
    status,
  } = req.body;
  const task = await Task.findByIdAndUpdate(
    { _id },
    {
      title,
      description,
      project,
      assignedBy,
      assignedTo,
      dueDate,
      priority,
      status,
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({ message: "task updated", data: task });
};

export const deleteTask = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const deletedTask = await Task.findByIdAndDelete({ _id });
  res.status(200).json({ message: "task deleted", deletedTask });
};
