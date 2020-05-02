const User = require("./../models/userModel");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const io = require("./../server").io;
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary,
  // filename: (req, file, cb) => `user-${req.params.id}-${Date.now()}.jpeg`, //TODO: Fix form upload and styling
  folder: "MaterialChat",
  transformation: [{ width: 400, height: 400, crop: "limit" }],
});

// Check if upload is image
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const parser = multer({ storage, fileFilter });

exports.cloudinaryPhotoUpload = parser.single("photo");

// function to limit req.body to specified properties
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//? WORKING VIA POSTMAN
// User update method
exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file, "req file");
  console.log(req.body, "req body");

  // 1. Create error if user POSTs password data, this is handled by authcontroller
  if (req.body.password || req.body.passwordConfirm) {
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
    filteredBody.photo = req.file.secure_url;
    filteredBody.photoId = req.file.public_id;
  }

  if (req.body.deletePhoto) {
    filteredBody.photo = "default.jpg";
    filteredBody.photoId = null;

    cloudinary.v2.uploader.destroy("sample", function (error, result) {
      console.log(result, error);
    });
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

//? WORKING VIA POSTMAN
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
//TODO: Fix these controller methods. Put working ones above.

exports.getAllUsers = factory.getAll(User);

// Made into Factory Func ---
// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   res.status(200).json({
//     status: "success",
//     results: users.length,
//     data: {
//       users
//     }
//   });
// });

//! Below are ADMIN CRUD methods --- These do not run middlewares...
//! Factory funcs are first and old versions are commented below.
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined. Please use /signup.",
  });
};

exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

// exports.createUser = async (req, res) => {
//   try {
//     // io.socket.emit(NEW_USER_CREATED, user);

//     // create new user from our model...
//     const newUser = await User.create(req.body);

//     res.status(201).json({
//       status: "success",
//       data: {
//         user: newUser
//       }
//     });
//   } catch (err) {
//     // 400 = bad request
//     res.status(400).json({
//       status: "fail",
//       message: err
//     });
//   }
// };

// exports.getUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     res.status(200).json({
//       status: "success",
//       data: {
//         user
//       }
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err
//     });
//   }
// };

// exports.updateUser = async (req, res) => {
//   // query mongoDB for doc to update, then update it
//   // takes optional options object, new property will
//   // return updated document rather than the original
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     });

//     res.status(200).json({
//       status: "success",
//       data: {
//         user
//       }
//     });
//   } catch (err) {
//     // 400 = bad request
//     res.status(404).json({
//       status: "fail",
//       message: err
//     });
//   }
// };

// exports.deleteUser = async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);

//     // Delete reponse status code is usually 204 - No Content
//     // When a delete request is sent, there is usually no response data sent back.
//     res.status(204).json({
//       status: "success",
//       data: null
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err
//     });
//   }
// };

// exports.getUserStats = async (req, res) => {
//   try {
//     // mongoDB aggregation - allows manipulation of data in a defined sequence of stages..
//     const stats = await User.aggregate([
//       {
//         // filter certain documents
//         $match: { ratingsAverage: { $gte: 4.5 } }
//       },
//       // group documents together using accumulators EX:
//       // calculate an average of a certain value across multiple tours
//       {
//         $group: {
//           // specify id to separate into groups EX: group by difficulty - easy, med, hard
//           // null will be process everything as one big group
//           _id: { $toUpper: "$difficulty" },
//           // Sum each document in the pipeline using 1 for each.
//           numUsers: { $sum: 1 },
//           numRatings: { $sum: "$ratingsQuantity" },
//           // use $avg operator with field $ratingsAverage to calculate avgRating across
//           // all tours
//           avgRating: { $avg: "$ratingsAverage" },
//           avgPrice: { $avg: "$price" },
//           minPrice: { $min: "$price" },
//           maxPrice: { $max: "$price" }
//         }
//       },
//       // at this point in the aggregation pipeline, you are limited to the scope of the
//       // previous aggregations. So you can only access properties that are available at
//       // this stage in the pipeline.
//       {
//         // sort by ascending order
//         $sort: { avgPrice: 1 }
//       }
//       // stages can also be repeated as needed.
//       // {
//       //   // match documents NOT EQUAL (ne) to _id of easy, which is
//       //   // difficulty as defined above on _id.
//       //   $match: { _id: { $ne: 'EASY' } }
//       // }
//     ]);

//     res.status(200).json({
//       status: "success",
//       data: stats
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err
//     });
//   }
// };
