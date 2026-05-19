import { Server } from "socket.io";

let io;

// Store online users
const onlineUsers = new Map();

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://mern-task-manager-app.netlify.app",
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // USER CONNECT
    socket.on("userConnected", (userId) => {
      onlineUsers.set(userId, socket.id);

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      console.log("Online Users:", onlineUsers);
    });

    //GET ONLINE USERS
    socket.on("getOnlineUsers", () => {
      socket.emit(
        "onlineUsers",
        Array.from(onlineUsers.keys())
      );
    });

    // JOIN TASK ROOM
    socket.on("joinTask", (taskId) => {
      socket.join(taskId);
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};