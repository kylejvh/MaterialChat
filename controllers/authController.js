const { promisify } = require("util");
const User = require("../models/userModel");

const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

// Create JWT token with secret and options object
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// const createSendToken = (user, statusCode, res) => {
//   const token = signToken(user._id);

//   const cookieOptions = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true
//   };

//   // Sends JWT over HTTPS cookie if env = production
//   if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

//   res.cookie("jwt", token, cookieOptions);

//   // Remove password from document output upon creation
//   user.password = undefined;

//   res.status(statusCode).json({
//     status: "success",
//     token,
//     data: {
//       user
//     }
//   });
// };

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id); // Token working...

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
    // secure: req.secure || req.headers["x-forwarded-proto"] === "https"
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
  });
};

//? WORKING VIA POSTMAN
//! This has no error handling...
//! Test on clientside - should also log user in on clientside after signup
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
  });

  createSendToken(newUser, 201, req, res);
});

//? WORKING VIA POSTMAN
//! Test on clientside - should also log user in on clientside after signup
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2. Check if user exists and password is correct

  // .select method will grab a select field that we need. use + to select a field
  // not included in db output
  const user = await User.findOne({ email }).select("+password");

  // user.correctPassword() - Call instance method to compare passwords IF user exists.
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //3 if everything is good, send token to client
  createSendToken(user, 200, req, res);
});

// Login and signup reviewed, looks to work correctly.
//! NOT SURE IF THIS IS WORKING CORRECTLY.
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
      new AppError("User recently changed password. Please log in again.", 401)
    );
  }

  // Grant access to protected routes if all checks pass.
  req.user = currentUser;
  next();
});

//! TEST with POSTMAN - should be working but chatroom routes need to be configured to test.
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

//! NOT WORKING VIA POSTMAN - REQUIRES DEBUGGING.
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
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email."
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

//! NOT WORKING VIA POSTMAN - REQUIRES DEBUGGING.
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Store if token has expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
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

  // 3. Update changedPasswordAt property for the user

  // 4. Log the user in, send token
  createSendToken(user, 200, res);
});

//? WORKING VIA POSTMAN
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2. Check if POSTed password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password was incorrect.", 401));
  }

  // 3. If correct, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4. Log user in, send JWT
  createSendToken(user, 200, req, res);
});

//TODO: WATCH VIDEO AND IMPLEMENT
//! This one is mainly for server side rendering, and I'm not sure I need it.
//! Rewatch course vid 189.
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
        return next();
      }

      // 3. Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // Grant access to protected routers if all checks pass.
      req.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

//! TEST with POSTMAN - should be working but chatroom routes need to be configured to test.
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
//TODO: WATCH VIDEO AND IMPLEMENT
exports.logout = (req, res) => {
  // Replaces cookie with a cookie of the same name, but with no login token. If you set up front end to check for cookie, you will be logged out.
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    status: "success"
  });
};
