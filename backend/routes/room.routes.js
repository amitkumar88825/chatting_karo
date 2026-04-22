const express = require("express");
const router = express.Router();
const { getActiveRoomId } = require("../controllers/room.controller");
const validate = require("../middleware/validate");


// health check route
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rooms API is running",
  });
});

// main routes
router.get("/active/:id", validate, getActiveRoomId);

module.exports = router;