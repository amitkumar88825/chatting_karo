const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getCurrentUser } = require("../controllers/auth.controller");
const validate = require("../middleware/validate");


// health check route
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth API is running",
  });
});

// main routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", validate, getCurrentUser);


module.exports = router;