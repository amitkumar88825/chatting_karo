const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References your User model
        required: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      enum: ["private", "group"],
      default: "private",
    },
  },
  { 
    timestamps: true // Automatically creates createdAt and updatedAt
  }
);

roomSchema.index({ participants: 1 });

module.exports = mongoose.model("Room", roomSchema);