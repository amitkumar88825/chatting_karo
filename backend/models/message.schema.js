const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: {
    type: String,
    enum: ["text", "image", "video", "audio", "file", "gif"],
    default: "text",
  },
  message: { type: String },
  text: { type: String },
  content: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
}); 

module.exports = mongoose.model("Message", messageSchema);