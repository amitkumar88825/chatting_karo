const User = require("../models/user.schema");

const getAllUsers = async (req, res) => {
  try {
    // optional: exclude logged-in user
    const currentUserId = req.user.id;

    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Build the main query
    const query = {
      _id: { $ne: currentUserId },
      ...searchQuery,
    };

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Get paginated users
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get current user's friend requests data in one go
    const currentUser = await User.findById(currentUserId)
      .populate(
        "sentFriendRequests",
        "_id username email fullName profilePic bio followers location createdAt",
      )
      .populate(
        "receivedFriendRequests",
        "_id username email fullName profilePic bio followers location createdAt",
      );

    // Create Maps for quick lookup
    const sentRequestsMap = new Map();
    const receivedRequestsMap = new Map();

    // Process sent friend requests
    if (
      currentUser.sentFriendRequests &&
      currentUser.sentFriendRequests.length > 0
    ) {
      currentUser.sentFriendRequests.forEach((request) => {
        const requestId = request._id.toString();
        sentRequestsMap.set(requestId, {
          _id: request._id,
          username: request.username,
          email: request.email,
          fullName: request.fullName,
          profilePic: request.profilePic,
          bio: request.bio,
          followers: request.followers,
          location: request.location,
          createdAt: request.createdAt,
          requestStatus: "pending",
          requestId: request._id,
        });
      });
    }

    // Process received friend requests
    if (
      currentUser.receivedFriendRequests &&
      currentUser.receivedFriendRequests.length > 0
    ) {
      currentUser.receivedFriendRequests.forEach((request) => {
        const requestId = request._id.toString();
        receivedRequestsMap.set(requestId, {
          _id: request._id,
          username: request.username,
          email: request.email,
          fullName: request.fullName,
          profilePic: request.profilePic,
          bio: request.bio,
          followers: request.followers,
          location: request.location,
          createdAt: request.createdAt,
          requestStatus: "pending",
          requestId: request._id,
        });
      });
    }

    // Enhance users with request status
    const enhancedUsers = users.map((user) => {
      const userId = user._id.toString();
      const isRequestSent = sentRequestsMap.has(userId);
      const isRequestReceived = receivedRequestsMap.has(userId);
      const sentRequest = sentRequestsMap.get(userId);
      const receivedRequest = receivedRequestsMap.get(userId);

      return {
        ...user.toObject(),
        requestSent: isRequestSent,
        requestReceived: isRequestReceived,
        requestId: sentRequest?.requestId || receivedRequest?.requestId || null,
        requestedAt:
          sentRequest?.createdAt || receivedRequest?.createdAt || null,
        isFollowing: isRequestSent, // For compatibility
        requestStatus:
          sentRequest?.requestStatus || receivedRequest?.requestStatus || null,
        // Include full request details if needed
        requestDetails: sentRequest || receivedRequest || null,
      };
    });

    // Separate sent and received requests for tabs (using the maps directly)
    const sentRequests = Array.from(sentRequestsMap.values());
    const receivedRequests = Array.from(receivedRequestsMap.values());

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      users: enhancedUsers,
      sentRequests: sentRequests,
      receivedRequests: receivedRequests,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Get Users Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAllFriends = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const user = await User.findById(currentUserId).populate(
      "friends",
      "username email profilePic",
    );
    res.status(200).json({
      success: true,
      friends: user.friends || [],
    });
  } catch (error) {
    console.error("Get Friends Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const sentFriendRequest = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { friendId } = req.body;

    console.log("Current User ID:", currentUserId);
    console.log("Friend ID:", friendId);

    if (!friendId) {
      return res.status(400).json({
        success: false,
        message: "friendId query parameter is required",
      });
    }

    console.log(43);

    const currentUser = await User.findById(currentUserId);
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({
        success: false,
        message: "Friend not found",
      });
    }

    console.log(52);

    if (friend.receivedFriendRequests.includes(currentUserId)) {
      return res.status(400).json({
        success: false,
        message: "Friend request already sent",
      });
    }

    console.log(60);

    friend.receivedFriendRequests.push(currentUserId);
    currentUser.sentFriendRequests.push(friendId);
    await friend.save();
    await currentUser.save();

    console.log(65);

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

module.exports = {
  getAllUsers,
  sentFriendRequest,
  getAllFriends,
};
