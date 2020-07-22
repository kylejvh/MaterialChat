const User = require("./../models/userModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const filterObj = require("./../utils/filterObj");
const io = require("../server");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Stores user avatar images on Cloudinary server
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req, file) => "MaterialChat",
    public_id: (req, file) => `user-${req.user._id}-${Date.now()}`,
    // transformation: [{ width: 400, height: 400, crop: "limit" }],
  },
});

// Checks if upload is image
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const parser = multer({
  storage,
  fileFilter,
});

exports.cloudinaryPhotoUpload = parser.single("photo");

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Create error if user POSTs password data, this is handled by authcontroller
  if (req.body.newPassword || req.body.newPasswordConfirm) {
    return next(
      new AppError(
        "This route is not configured for password updates. Please use the correct route.",
        400
      )
    );
  }

  // 2. Filtered out field names that should not be updated
  const filteredBody = filterObj(
    req.body,
    "username",
    "email",
    "currentChatroom"
  );

  if (req.file) {
    filteredBody.photo = req.file.path;
    filteredBody.photoId = req.file.filename;
  }

  if (req.body.deletePhoto) {
    cloudinary.uploader.destroy(req.body.photoId, function (error, result) {
      if (error) {
        return next(
          new AppError("Error encountered during user photo deletion", 500)
        );
      }
    });

    filteredBody.photo = "default.jpg";
    filteredBody.photoId = null;
  }

  // 3. Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Reserved for future use - middleware that allows use of /me with url params
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = catchAsync(async (req, res, next) => {
  let query = User.findById(req.params.id);

  const doc = await query;

  if (!doc) {
    return next(new AppError("No document with specified ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.setDBActiveSocketId = catchAsync(async (userId, socketId) => {
  await User.findByIdAndUpdate(
    userId,
    { activeSocketId: socketId },
    {
      new: true,
      runValidators: true,
    }
  );
});

exports.updateDBActiveChatroom = catchAsync(
  async (currentChatroomId, userId) => {
    await User.findByIdAndUpdate(
      userId,
      { currentChatroom: currentChatroomId },
      {
        new: true,
        runValidators: true,
      }
    );
  }
);

//! Admin CRUD methods - reserved for future use.
// exports.createUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "This route is not defined. Please use /signup.",
//   });
// };
// exports.getAllUsers = factory.getAll(User);
// exports.getUser = factory.getOne(User);
// exports.updateUser = factory.updateOne(User);
// exports.deleteUser = factory.deleteOne(User);
