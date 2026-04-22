


const express = require("express");
const router = express.Router();
const { getMessages } = require("../controllers/message.controller");

// health check route
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Messages API is running",
  });
});

// main routes
router.get("/:friendId", getMessages);

module.exports = router;