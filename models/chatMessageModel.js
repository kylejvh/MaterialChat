const mongoose = require("mongoose");

// What should I add to this schema?
const chatMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      trim: true,
      required: [true, "Message cannot be empty."],
    },
    // Reference to user sending message - of User Model
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A message must belong to a user."],
    },
    // Reference to origin chatroom of message - of Chatroom Model
    sentInChatroom: {
      type: mongoose.Schema.ObjectId,
      ref: "Chatroom",
    },
    images: [String],
    // Get timestamp of message creation
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Append specified references when messages are fetched with selected fields
chatMessageSchema.pre(/^find/, function (next) {
  this.populate({
    path: "sender",
    select: "username photo",
  });

  next();
});

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = ChatMessage;
