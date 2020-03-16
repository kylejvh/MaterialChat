const crypto = require("crypto");
const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "A username must be specified."],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  role: {
    type: String,
    //TODO: implement handling of chatroom creation -
    //TODO: Track an array of chatrooms created???
    // reference lesson 133
    enum: ["user", "admin"],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    // Select - never show this field in output
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: "Passwords are not the same!"
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  //! Used for account deletion
  active: {
    type: Boolean,
    default: true,
    select: false
  },

  // Specify imageCover url or filepath, and we read from the fs later. This is just a
  // reference.
  // Consider renaming to avatarImage
  photo: {
    type: String,
    default: "default.jpg"
  },
  slug: String,
  // Get timestamp of creation
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },

  // Implement discord nitro-like premium features upon payment.
  // Is it best practice to keep these on schema???
  // Node.js course had a lesson on middlewares and removing secret properties...
  isPremium: {
    type: Boolean,
    default: false
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  // handle here, or keep array of users on the chatroom schema?

  //TODO: figure out how to model the data and best relationship type...
  //! CURRENT: PARENT REFERENCING...
  currentChatroom: {
    // PARENT REFERENCE
    type: mongoose.Schema.ObjectId,
    ref: "Chatroom"

    //! CURRENT IMPLEMENTATION GUESS:
    // chatroom: ObjectID(23) <- references a chatroom's mongodb id
  },
  createdChatrooms: {
    type: mongoose.Schema.ObjectId,
    ref: "Chatroom"
  }
});

//TODO -  socket.io:
// userSchema.pre('something', function(next) {
//   io.Socket.on(...)
// })

userSchema.pre("save", async function(next) {
  // Only run this function if password was modified
  if (!this.isModified("password")) return next();

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field, not needed in DB
  this.passwordConfirm = undefined;
  next();
});

// If password has been changed after user signup, update document
userSchema.pre("save", function(next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Middileware - match any find type query and remove
// inactive (deleted) users from output
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

// Instance method - use bcrypt to compare password user enters to hashed password
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method - Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  // check if passwordChangedAt property exists on user document
  if (this.passwordChangedAt) {
    // See how long ago password was changed...
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // If token was issued before password was changed, return true
    return JWTTimestamp < changedTimestamp;
  }

  // Password has not been changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);
  // Set expiration field - Reset token expires in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
