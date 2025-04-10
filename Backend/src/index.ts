import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import "express-async-errors";
import { connectDB } from "./ConnectDB/Connect";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  login,
  sendOtp,
  updatePassword,
  updateUser,
  verifyOtp,
} from "./Controllers/userController";
import { authentication } from "./Middleware/auth";
import { upload } from "./storage";
import path from "path";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProject,
  updateProject,
} from "./Controllers/projectController";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTasksProject,
  getTasksUser,
  updateTask,
} from "./Controllers/taskController";
import Message from "./Schemas/messageSchema";
import {
  deleteMessage,
  getAllMessages,
  getMessages,
} from "./Controllers/messageController";
dotenv.config();
const app = express();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "..", "images")));
app.use(express.static(path.join(__dirname, "..", "")));
app.use(cors());
connectDB();
// console.log("Serving images from:", path.join(__dirname, "images"));

// User
app.post("/createUser", createUser);
app.put("/updateUser/:id", upload.single("dp"), updateUser);
app.delete("/deleteUser/:id", deleteUser);
app.get("/getUser", authentication, getUser);
app.get("/getUsers", getUsers);

// login and role
app.post("/login", login);
// app.get("/", authentication);

//assignning members for projects (admin)
app.post("/createProject", createProject);
app.get("/getProject/:_id", getProject);
app.get("/getAllProjects", getAllProjects);
app.put("/updateProject/:_id", updateProject);
app.delete("/deleteProject/:_id", deleteProject);

// task manipulation
app.post("/createtask", createTask);
app.get("/getTasksUser/:_id", getTasksUser);
app.get("/getTasksProject/:_id", getTasksProject);
app.get("/getAllTasks", getAllTasks);
app.put("/updateTask/:_id", updateTask);
app.delete("/deleteTask/:_id", deleteTask);

//  Messages
app.get("/getMessages/:senderId/:recieverId", getMessages);
app.delete("/deleteMessage/:id", deleteMessage);
app.get("/getAllMessages", getAllMessages);

// forgot password
app.post("/sendOtp", sendOtp);
app.post("/verifyOtp", verifyOtp);
app.post("/updatePassword", updatePassword);

// Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("userConnected", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("Online user:", onlineUsers);
    socket.emit("onlineUsers", [...onlineUsers.keys()]);
  });

  socket.on("sendMessage", async ({ senderId, message, recieverId }) => {
    console.log(`Message from ${senderId} to ${recieverId}: ${message}`);

    const recieverSocketId = onlineUsers.get(recieverId);
    const newMessage = await Message.create({
      senderId,
      message,
      recieverId,
      seen: false,
    });

    if (recieverSocketId) {
      socket.to(recieverSocketId).emit("recieveMessage", newMessage);
      socket.to(recieverSocketId).emit("messageDelivered", {
        senderId,
        recieverId,
      });
    }
  });

  socket.on("markAsSeen", async ({ senderId, recieverId }) => {
    try {
      await Message.updateMany(
        { senderId, recieverId, seen: false },
        { $set: { seen: true } }
      );

      const senderSocketId = onlineUsers.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageSeen", {
          senderId,
          recieverId,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.log("Error updating seen status", error);
    }
  });

  socket.on("deleteMessage", async (messageId) => {
    try {
      await Message.findByIdAndDelete(messageId);
      io.emit("messageDeleted", messageId);
    } catch (error) {
      console.log("Error deleting message:", error);
    }
  });
  socket.on("disconnect", () => {
    onlineUsers.forEach((socketId, userId) => {
      if (socket.id === socketId) {
        onlineUsers.delete(userId);
      }
    });
    console.log("Online users after disconnecting", onlineUsers);
  });
});

const PORT = process.env.port || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
