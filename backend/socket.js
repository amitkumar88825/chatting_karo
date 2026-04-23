const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./models/message.schema");

let io;
const userSockets = new Map();

const initSocket = (server, allowedOrigins) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    registerSocketHandlers(io, socket);

    socket.on("disconnect", (reason) => {
      console.log("User disconnected:", socket.id, "Reason:", reason);
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

const registerSocketHandlers = (io, socket) => {
  socket.on("register_user", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("join_room", (roomId) => {
    if (!roomId) return;
    socket.join(roomId);
    const roomSockets = io.sockets.adapter.rooms.get(roomId);
    socket.emit("joined_room", {
      roomId,
      success: true,
      roomSize: roomSockets?.size || 0,
    });
  });

  // Save message to database before broadcasting
  socket.on("send_message", async (data, callback) => {
    if (!data.roomId || !data.senderId) {
      if (callback)
        callback({ status: "error", message: "Missing roomId or senderId" });
      return;
    }

    try {
      let messageId = data._id || new mongoose.Types.ObjectId().toString();

      // Normalize text for non‑text messages
      let textContent = data.message || data.text;
      if (!textContent && data.type && data.type !== "text") {
        switch (data.type) {
          case "gif":
            textContent = "📹 GIF";
            break;
          case "image":
            textContent = "🖼️ Image";
            break;
          case "video":
            textContent = "🎥 Video";
            break;
          case "audio":
            textContent = "🎤 Voice message";
            break;
          case "file":
            textContent = `📎 ${data.content?.fileName || "File"}`;
            break;
          default:
            textContent = "";
        }
      }

      const messageDoc = {
        _id: messageId,
        roomId: data.roomId,
        senderId: data.senderId,
        type: data.type || "text",
        text: textContent,
        message: textContent, // for backward compatibility
        content: data.content || null,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      };

      const savedMessage = await Message.findOneAndUpdate(
        { _id: messageId },
        messageDoc,
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      io.to(data.roomId).emit("receive_message", savedMessage);
      if (callback) callback({ status: "ok", messageId: savedMessage._id });
    } catch (error) {
      console.error("Error saving message:", error);
      if (callback) callback({ status: "error", message: error.message });
      socket.emit("message_error", { tempId: data._id, error: error.message });
    }
  });

  socket.on("leave_room", (roomId) => {
    if (roomId) {
      socket.leave(roomId);
      socket.emit("left_room", { roomId, success: true });
    }
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };
