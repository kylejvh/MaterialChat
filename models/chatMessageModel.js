const mongoose = require("mongoose");
const slugify = require("slugify");

// What should I add to this schema?
const chatMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      // trim: true
      required: [true, "Message cannot be empty."]
    },
    //! private messaging?
    private: {
      type: Boolean
      //! add recipient for private
    },
    //TODO: figure out how to model the data and best relationship type...
    //! CURRENT: PARENT REFERENCING...
    sender: {
      //? more recent guess:
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A message must belong to a user."]
      //
      // PARENT REFERENCE
      //! CURRENT IMPLEMENTATION GUESS:
      // user: ObjectID(12) <- references a user's mongodb id
    },
    sentInChatroom: {
      type: mongoose.Schema.ObjectId,
      ref: "Chatroom"
    },
    // To specify a type of array, with strings as values:
    images: [String],
    // Get timestamp of creation
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    }
  },
  // when you have virtual properties, show them when theres an output?
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//! How do I implement populate? Is it even helpful?
// use virtual populate...
chatMessageSchema.pre(/^find/, function(next) {
  this.populate({
    path: "sender",
    select: "username photo"
  });

  next();
});

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = ChatMessage;
