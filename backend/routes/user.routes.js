const express = require("express");
const router = express.Router();
const { getAllUsers, 
  sentFriendRequest, 
  getAllFriends } = require("../controllers/user.controller");


// health check route
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User API is running",
  });
});

// main routes
router.get("/all", getAllUsers);

router.post("/sent-request", sentFriendRequest);

router.get("/friends", getAllFriends);


module.exports = router;