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
    socket.emit("joined_room", { roomId, success: true, roomSize: roomSockets?.size || 0 });
  });

  // ✅ Save message to database before broadcasting
  socket.on("send_message", async (data, callback) => {
    if (!data.roomId || !data.senderId) {
      if (callback) callback({ status: "error", message: "Missing roomId or senderId" });
      return;
    }

    try {
      // Use client-provided _id if available (for idempotency), else generate a new one
      let messageId = data._id;
      if (!messageId) {
        messageId = new mongoose.Types.ObjectId().toString();
      }

      const messageText = data.message || data.text;

      // Prepare the message document
      const messageDoc = {
        _id: messageId,
        roomId: data.roomId,
        senderId: data.senderId,
        type: data.type || "text",
        text: messageText,
        message: messageText,
        content: data.content || null,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      };

      // Save to MongoDB (upsert to avoid duplicates if same _id is sent again)
      const savedMessage = await Message.findOneAndUpdate(
        { _id: messageId },
        messageDoc,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // Broadcast the saved message to everyone in the room
      io.to(data.roomId).emit("receive_message", savedMessage);

      // Acknowledge success to the sender
      if (callback) callback({ status: "ok", messageId: savedMessage._id });
    } catch (error) {
      console.error("Error saving message:", error);
      if (callback) callback({ status: "error", message: error.message });
      // Optionally emit an error event to the sender
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