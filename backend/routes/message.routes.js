


const express = require("express");
const router = express.Router();
const { getMessages } = require("../controllers/message.controller");
const validate = require("../middleware/validate");


// health check route
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Messages API is running",
  });
});

// main routes
router.get("/:friendId", validate, getMessages);

module.exports = router;