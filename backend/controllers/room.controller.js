

const Room = require("../models/room.schema");


// Get active room ID for a user
const getActiveRoomId = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user
        const friendId = req.params.id; // Friend's user ID from the route parameter

        // Find the active room between the user and the friend
        const room = await Room.findOne({
            members: { $all: [userId, friendId] },
            isActive: true
        });

        if (!room) {
            const newRoom = new Room({
                members: [userId, friendId],
                isActive: true
            });
            await newRoom.save();
            return res.status(200).json({
                success: true,
                roomId: newRoom._id
            });
        }
        res.status(200).json({
            success: true,
            roomId: room._id
        });
    } catch (error) {
        console.error("Error fetching active room ID:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching active room ID"
        });
    }
};

module.exports = {
    getActiveRoomId
};