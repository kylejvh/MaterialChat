const mongoose = require("mongoose");
const slugify = require("slugify");

const chatroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A chatroom name must be specified."],
      unique: true,
      trim: true
    },
    slug: String,
    //! How should I handle private chatrooms?
    //! Should I require a password?
    //! Where should the password be stored?
    //! Look for answers in node.js course
    private: {
      type: Boolean
      // required: [true, "Chatroom privacy must be specified"]
    },
    description: {
      type: String,
      trim: true
    },
    // Specify imageCover url or filepath, and we read from the fs later. This is just a
    // reference.
    //! Have an image to represent the chatroom?
    imageCover: {
      type: String
      // required: [true, "A tour must have a cover image"]
    },
    // To specify a type of array, with strings as values:
    images: [String],
    // Get timestamp of creation
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    // Reference user who created chatroom
    //TODO: implement front end/back end - check to see if logged in user
    //TODO: is the creator, and show delete options for that user.
    //TODO: can you use the restrict middleware for this?
    //TODO: Populate is on for this when getting chatroom, do you need it?

    //! Creator populate is now correctly working...
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Chatroom must have a creator"]
    }
    //TODO: figure out how to model the data and best relationship type...
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

chatroomSchema.virtual("messages", {
  ref: "ChatMessage",
  localField: "_id",
  foreignField: "sentInChatroom"
});

// Virtual Populate - Ties chatrooms to messages
// chatroomSchema.virtual("messages", {
//   ref: "ChatMessage",
//   foreignField: "chatroom",
//   localField: "_id"
// });

// Every find-type query will be populated with creator's username.
chatroomSchema.pre(/^find/, function(next) {
  this.populate({ path: "creator", select: "username" });

  next();
});

//TODO: Another Potential Virtual Populate - GETTING CURRENT ACTIVE USERS of CHATROOM
// chatroomSchema.virtual("activeUsers", {
//   ref: "Users",
//   foreignField: "currentChatroom",
//   localField: "_id"
// });

const Chatroom = mongoose.model("Chatroom", chatroomSchema);

module.exports = Chatroom;
