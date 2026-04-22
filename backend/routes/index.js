const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const roomRoutes = require("./room.routes");
const uploadRoutes = require("./upload.routes");
const messageRoutes = require("./message.routes");
const path = require("path");

// health check route
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running 🚀",
  });
});

// main routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/rooms", roomRoutes);
router.use("/upload", uploadRoutes);
router.use("/messages", messageRoutes);






module.exports = router;