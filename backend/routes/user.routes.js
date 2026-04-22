const express = require("express");
const router = express.Router();
const { getAllUsers, 
  sentFriendRequest, 
  allSentFriendRequests, 
  allReceivedFriendRequests,
  getAllFriends } = require("../controllers/user.controller");
const validate = require("../middleware/validate");


// health check route
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User API is running",
  });
});

// main routes
router.get("/all", validate, getAllUsers);

router.post("/sent-request", validate, sentFriendRequest);

router.get("/friends", validate, getAllFriends);


module.exports = router;