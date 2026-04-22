const User = require("../models/user.schema");

const getAllUsers = async (req, res) => {
  try {
    // optional: exclude logged-in user
    const currentUserId = req.user.id;

    const users = await User.find({
      _id: { $ne: currentUserId }, 
    })
      .select("-password") 
      .sort({ createdAt: -1 }); 

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const sentFriendRequest = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { friendId } = req.query;
    if (!friendId) {
      return res.status(400).json({
        success: false,
        message: "friendId query parameter is required",
      });
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({
        success: false,
        message: "Friend not found",
      });
    }

    if (friend.friendRequests.includes(currentUserId)) {
      return res.status(400).json({
        success: false,
        message: "Friend request already sent",

      });
    }

    friend.friendRequests.push(currentUserId);
    await friend.save();

    res.status(200).json({
      success: true,
      message: "Friend request sent",

    });
  } catch (error) {
    console.error("Send Friend Request Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const allSentFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const user = await User.findById(currentUserId).populate("sentFriendRequests", "name email");

    res.status(200).json({
      success: true,
      requests: user.sentFriendRequests || [],
    });
  } catch (error) {
    console.error("Get Sent Friend Requests Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const allReceivedFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const users = await User.find({ receivedFriendRequests: currentUserId }).select("name email");

    res.status(200).json({
      success: true,
      requests: users || [],
    });
  } catch (error) {
    console.error("Get Received Friend Requests Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getAllUsers,
  sentFriendRequest,
  allSentFriendRequests,
  allReceivedFriendRequests,
};