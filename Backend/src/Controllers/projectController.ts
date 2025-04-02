import Project from "../Schemas/projectSchema";
import { Request, Response } from "express";

// create prject(set title,discription ,team members,team lead,due date,priority,) - admin will do it and

// create Project
export const createProject = async (req: Request, res: Response) => {
  const { title, description, members, teamLead, dueDate, priority, status } =
    req.body;

  try {
    const newProject = new Project({
      title,
      description,
      members,
      teamLead,
      dueDate,
      priority,
      status,
    });
    await newProject.save();
    res.status(200).json({ message: "Project created", newProject });
  } catch (error) {
    console.log(error);
    res.status(500).send("some problem with creating project");
  }
};

// get project
export const getProject = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const project = await Project.find({
    $or: [{ teamLead: _id }, { members: _id }],
  });
  res.status(200).json({ message: "got the project", data: project });
};

// get Projects for admin
export const getAllProjects = async (req: Request, res: Response) => {
  const projects = await Project.find({});
  res
    .status(200)
    .json({ message: "got the projects for admin", data: projects });
};

// update project
export const updateProject = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const { title, description, members, teamLead, dueDate, priority, status } =
    req.body;
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      { _id },
      { title, description, members, teamLead, dueDate, priority, status },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "updated project", data: updatedProject });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server errrorey");
  }
};

// Delete project
export const deleteProject = async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    const deletedProject = await Project.findByIdAndDelete({ _id });
    res.status(200).json({ message: "deleted project", data: deletedProject });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server errrorey");
  }
};
