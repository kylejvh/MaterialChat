const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Email = require("./../utils/email");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Create JWT token with secret and options object
const signToken = (id, isGuest = null) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: isGuest ? "0.5 hrs" : process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  // Sign token for guest or fully registered account.
  const token =
    user.role === "guest" ? signToken(user._id, true) : signToken(user._id);

  const cookieExpiration =
    user.role === "guest"
      ? new Date(Date.now() + 1800000)
      : new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        );

  res.cookie("jwt", token, {
    expires: cookieExpiration,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: true,
  });

  // Removes password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    // token,   <- Token access in JavaScript not currently needed on front end, not sent on response body throughout application
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  // Only send welcome emails to new users in production
  if (process.env.NODE_ENV === "production") {
    // Optional url not included, reserved for future use case.
    await new Email(
      newUser
      // url
    ).sendWelcome();
  }

  createSendToken(newUser, 201, req, res);
});

exports.signupGuest = catchAsync(async (req, res, next) => {
  const date = new Date();
  const dateID = `${
    date.getMonth() + 1
  }${date.getDate()}${date.getFullYear().toString().substring(2, 4)}`;
  const randomInt =
    Math.floor(Math.random() * (Math.floor(9999) - Math.ceil(0001))) + 0001;

  // Create a temporary guest account that expires in 30 minutes.
  const guestUser = await User.create({
    username: `Guest${randomInt}-${dateID}`,
    email: `Guest${dateID}-${randomInt}@temporaryaccount.net`,
    role: "guest",
    password: `temp${randomInt}${dateID}`,
    passwordConfirm: `temp${randomInt}${dateID}`,
  });

  createSendToken(guestUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2. Check if user exists and password is correct

  // .select method will grab a specific field that we need. use + to select a field
  // not included in db output
  const user = await User.findOne({ email }).select("+password");

  // user.correctPassword() - Call instance method to compare passwords IF user exists.
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3. If everything is good, send token to client
  createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Get token and check if it exists, send error if not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2. Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists - user may delete account after token is issued. Token will still be valid if not expired and not handled correctly.
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user associated with this token no longer exists.", 401)
    );
  }

  // 4. Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("Password recently changed. Please log in again.", 401)
    );
  }

  // Grant access to protected routes if all checks pass.
  req.user = currentUser;
  next();
});

exports.verifyPassword = catchAsync(async (req, res, next) => {
  // If handling chatroom or avatar data, don't require password
  if (
    (req.file && req.file.fieldname === "photo") ||
    (req.body.deletePhoto && req.body.photoId) ||
    (req.body.currentChatroom && req.body.type === "chatroom")
  ) {
    return next();
  }

  // Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  if (!req.body.passwordCurrent) {
    return next(new AppError("Please provide your current password.", 401));
  }

  // Check if POSTed password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password was incorrect.", 401));
  }

  // If correct, continue to next middlewware.
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the email input
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError(
        "A user with the specified email address does not exist.",
        404
      )
    );
  }

  // 2. Generate the random reset token, save onto user document without validating required fields
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send it to the user's email
  try {
    const resetURL =
      process.env.NODE_ENV === "development"
        ? `${req.protocol}://localhost:3000/reset/${resetToken}`
        : `${req.protocol}://${req.get("host")}/reset/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email.",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later."),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Store if token has expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. If token has not expired, and there is a user, set the new password.
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3. Log the user in, send token
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Final verification that required data is present
  if (!req.body.newPassword || !req.body.newPasswordConfirm) {
    return next(
      new AppError("Please provide and confirm a new password.", 401)
    );
  }

  // Get user from collection
  const user = await User.findById(req.user.id).select("+password");
  // Check if POSTed password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password was incorrect.", 401));
  }

  //  If correct, update password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  // Log user in, send JWT
  createSendToken(user, 200, req, res);
});

// Used for persistence of user login, will return 204 no content instead of errors if req.cookies.jwt is not present.
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1. Verification of token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2. Check if user still exists - user may delete account after token is issued. Token will still be valid if not expired and not handled correctly.
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next(
          new AppError(
            "Invalid login token. Please clear your cookies and log in.",
            401
          )
        );
      }

      // 3. Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
          new AppError("Password recently changed. Please log in again.", 401)
        );
      }

      // Set req.user info for use in next middlewares
      req.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  } else {
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles will be a passed in array of roles allowed to access endpoint
    // EX: only roles = ["admin"] can delete a document

    // Forbid user without required role
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }
  };
};

exports.logout = (req, res) => {
  // Clears token cookie
  res.clearCookie("jwt");
  res.status(200).json({
    status: "success",
  });
};
