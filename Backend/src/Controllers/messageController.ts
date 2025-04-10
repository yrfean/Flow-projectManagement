import { Request, Response } from "express";
import Message from "../Schemas/messageSchema";
import messageSchema from "../Schemas/messageSchema";

export const getMessages = async (req: Request, res: Response) => {
  const { senderId, recieverId } = req.params;
  console.log(senderId, recieverId);
  try {
    const messages = await Message.find({
      $or: [
        { senderId, recieverId }, // Messages sent by sender to receiver
        { senderId: recieverId, recieverId: senderId }, // Messages sent by receiver to sender
      ],
    }).sort({ createdAt: 1 });
    if (!messages) {
      console.log("no messages");
      return;
    }
    console.log("messages grom db:", messages);
    res.status(200).json({ Message: "got the messages", data: messages });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "couldnt find the messages of them!" });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      res.status(404).json({ message: "Message not found" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const allMessages = await Message.find({});
    res.status(200).json({ isSuccess: true, allMessages });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "internal server err babbyy", isSuccess: false });
  }
};
