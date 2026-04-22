

const Message = require("../models/message.schema");
const Room = require("../models/room.schema");


const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { friendId } = req.params;

    const room = await Room.findOne({
      type: 'private',
      members: { $all: [currentUserId, friendId] }
    });

    if (!room) {
      return res.status(200).json([]); // no messages yet
    }

    const messages = await Message.find({ roomId: room._id }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMessages };