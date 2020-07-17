const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A chatroom name must be specified"],
      unique: true,
      trim: true,
      minlength: [2, "Chatroom names must be 2 characters or more"],
      maxlength: [25, "Chatroom names must be 25 characters or less"],
    },
    slug: String,
    description: {
      type: String,
      trim: true,
      minlength: [3, "Description must be 3 characters or more"],
      maxlength: [50, "Description must be 50 characters or less"],
    },
    // Get timestamp of creation
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    // Reference to user who created chatroom - of User Model
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Chatroom must have a creator"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate - retrieves/populates messages relating to a specific chatroom.
chatroomSchema.virtual("messages", {
  ref: "ChatMessage",
  localField: "_id",
  foreignField: "sentInChatroom",
});

// Virtual populate - retrieves/populates active users currently in a specfic chatroom.
chatroomSchema.virtual("activeUsers", {
  ref: "User",
  localField: "_id",
  foreignField: "currentChatroom",
});

// Every find-type query will be populated with creator's username.
chatroomSchema.pre(/^find/, function (next) {
  this.populate({ path: "creator", select: "username" });

  next();
});

const Chatroom = mongoose.model("Chatroom", chatroomSchema);

module.exports = Chatroom;
