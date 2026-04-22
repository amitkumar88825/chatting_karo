const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://192.168.31.203:5173",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://172.30.80.1:5173",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket", "polling"],
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date(),
  });
});

app.use("/api", require("./routes/index"));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Store user socket mappings (optional but helpful)
const userSockets = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  console.log("Total connected clients:", io.engine.clientsCount);

  // Store user ID with socket
  socket.on("register_user", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });

  // Join room handler
  socket.on("join_room", (roomId) => {
    try {
      if (!roomId) {
        console.error("Invalid room ID provided");
        socket.emit("error", { message: "Invalid room ID" });
        return;
      }

      // Join the room
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);

      // Get all sockets in the room for debugging
      const roomSockets = io.sockets.adapter.rooms.get(roomId);
      console.log(`Room ${roomId} now has ${roomSockets?.size || 0} clients`);

      socket.emit("joined_room", {
        roomId,
        success: true,
        roomSize: roomSockets?.size || 0,
      });
    } catch (error) {
      console.error(`Error joining room ${roomId}:`, error);
    }
  });

  // Handle sending messages - IMPORTANT: Broadcast to room
  socket.on("send_message", (data) => {
    try {
      console.log("Message received on server:", {
        roomId: data.roomId,
        senderId: data.senderId,
        message: data.message || data.text,
      });

      if (!data.roomId || !data.senderId) {
        console.error("Missing required fields");
        return;
      }

      const messageText = data.message || data.text;
      if (!messageText || messageText.trim() === "") {
        console.error("Empty message");
        return;
      }

      const messageToSend = {
        _id: Date.now().toString(),
        roomId: data.roomId,
        senderId: data.senderId,
        text: messageText,
        message: messageText,
        timestamp: new Date(),
      };

      // Broadcast to ALL clients in the room (including sender)
      io.to(data.roomId).emit("receive_message", messageToSend);
      console.log(`Message broadcasted to room ${data.roomId}`);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Leave room handler
  socket.on("leave_room", (roomId) => {
    try {
      if (roomId) {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room: ${roomId}`);
        socket.emit("left_room", { roomId, success: true });
      }
    } catch (error) {
      console.error(`Error leaving room ${roomId}:`, error);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("User disconnected:", socket.id, "Reason:", reason);
    // Remove from userSockets mapping
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`User ${userId} removed from socket mapping`);
        break;
      }
    }
    console.log("Remaining connected clients:", io.engine.clientsCount);
  });
});

// Test endpoint
app.get('/test-broadcast', (req, res) => {
  io.emit('receive_message', {
    _id: 'test',
    text: 'Test broadcast message',
    senderId: 'system',
    timestamp: new Date()
  });
  res.json({ message: 'Test broadcast sent' });
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Socket.IO server is ready`);
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(", ")}`);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

module.exports = { app, server, io };
