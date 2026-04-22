const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

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


module.exports = router;