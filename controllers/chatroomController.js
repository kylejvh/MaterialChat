const Chatroom = require("./../models/chatroomModel");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const multer = require("multer");

// function to limit req.body to specified properties
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// When creating chatroom, if no chatroom creator is specified on body,
// take id from signed in user
exports.setChatroomCreatorIds = (req, res, next) => {
  if (!req.body.creator) req.body.creator = req.user._id;
  next();
};

// If you need to populate all find methods, view video
// 152 for making a populate middleware...
//! TEST VIA POSTMAN -- POPULATE NOT WORKING...
// POPULATE MESSAGES USING THIS FUNC

//! Replaced with factory - test it thoroughly

exports.getChatroom = catchAsync(async (req, res, next) => {
  //TODO: limit response population of messages to needed fields and length.
  // TODO: ex: you don't want to fetch more than 100 messages at once...
  const chatroom = await Chatroom.findById(req.params.id)
    .populate({
      path: "messages",
      select: "message",
    })
    .populate({ path: "activeUsers", select: "username" });

  if (!chatroom) {
    return next(new AppError("No Chatroom with specified ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      chatroom,
    },
  });
});

//TODO: CONVERT ALL TO FACTORY FUNCs

//? POST WORKING
//TODO: IMPLEMENT NOTIFICATIONS AND ERROR
// exports.createChatroom = catchAsync(async (req, res, next) => {
//   const newChatroom = await Chatroom.create({
//     name: req.body.name,
//     creator: req.user.id
//   });

//   res.status(201).json({
//     status: "success",
//     data: {
//       newChatroom
//     }
//   });
// });

//! IMPLEMENT LATER AND TEST VIA POSTMAN - YOU NEED TO VERIFY THE CREATOR OF THE CHATROOM...

//! Factory Func rewrites
//? All Tested and working via postman...

//? Working via postman --
//! Though populate is still broken...
// exports.getChatroom = factory.getOne(Chatroom, {
//   path: "creator"
// });
exports.updateChatroom = factory.updateOne(Chatroom);
exports.deleteChatroom = factory.deleteOne(Chatroom);

//! NOT WORKING AS ABOVE
//TODO: Attach required fields?

exports.createChatroom = factory.createOne(Chatroom, {
  path: "creator",
  select: "username",
});

//! Replaced with factory above...
//! Can only currently update chatroom name...
// // User update method
// exports.updateChatroom = catchAsync(async (req, res, next) => {
//   // 1. Create error if user POSTs password data, this is handled by authcontroller
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError(
//         "This route is not configured for password updates. Please use the correct route.",
//         400
//       )
//     );
//   }

//   // 2. Filtered out field names, includes only fields that should be updated
//   const filteredBody = filterObj(req.body, "name");

//   // 3. Update user document
//   const updatedChatroom = await Chatroom.findByIdAndUpdate(
//     req.chatroom.id,
//     filteredBody,
//     {
//       new: true,
//       runValidators: true
//     }
//   );

//   res.status(200).json({
//     status: "success",
//     data: {
//       chatroom: updatedChatroom
//     }
//   });
// });

//TODO: Implement delete handling of chatroom just like user,
//TODO: Use active field to remove from output rather than wiping DB completely.
//! TEST VIA POSTMAN

//! Replaced with factory above...
// exports.deleteChatroom = catchAsync(async (req, res, next) => {
//   await Chatroom.findByIdAndUpdate(req.chatroom.id, { active: false });

//   res.status(204).json({
//     status: "success",
//     data: null
//   });
// });

//TODO: Fix these controller methods. Put working ones above.
//! TEST VIA POSTMAN
exports.getAllChatrooms = catchAsync(async (req, res, next) => {
  const chatrooms = await Chatroom.find();

  res.status(200).json({
    status: "success",
    results: chatrooms.length,
    data: {
      chatrooms,
    },
  });
});
