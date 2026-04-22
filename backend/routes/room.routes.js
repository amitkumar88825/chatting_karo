const express = require("express");
const router = express.Router();
const { getActiveRoomId } = require("../controllers/room.controller");

// health check route
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rooms API is running",
  });
});

// main routes
router.get("/active/:id", getActiveRoomId);

module.exports = router;