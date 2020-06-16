const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A chatroom name must be specified."],
      unique: true,
      trim: true,
    },
    slug: String,
    description: {
      type: String,
      trim: true,
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
