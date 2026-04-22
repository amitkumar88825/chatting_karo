const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const roomRoutes = require("./room.routes");
const uploadRoutes = require("./upload.routes");
const messageRoutes = require("./message.routes");
const path = require("path");
const validate = require("../middleware/validate");

  
// health check route
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running 🚀",
  });
});

// main routes
router.use("/auth", authRoutes);
router.use("/users", validate, userRoutes);
router.use("/rooms", validate, roomRoutes);
router.use("/upload", validate, uploadRoutes);
router.use("/messages", validate, messageRoutes);


module.exports = router;