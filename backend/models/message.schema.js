// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
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
  message: { type: String }, // for text messages
  text: { type: String },
  content: { type: mongoose.Schema.Types.Mixed }, // for files, gifs, etc.
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
