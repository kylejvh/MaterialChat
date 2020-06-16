const Chatroom = require("./../models/chatroomModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");

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

exports.getChatroom = catchAsync(async (req, res, next) => {
  const chatroom = await Chatroom.findById(req.params.id)
    .populate({
      path: "messages",
      select: "message",
    })
    .populate({ path: "activeUsers", select: "username" });

  //! This is not doing anything
  if (!chatroom) {
    console.log("was i hit?");
    return next(new AppError("No chatroom found with the specified ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      chatroom,
    },
  });
});

// exports.getChatroom = factory.getOne(Chatroom, {
//   path: "creator"
// });

exports.updateChatroom = factory.updateOne(Chatroom);
exports.deleteChatroom = factory.deleteOne(Chatroom);

exports.createChatroom = factory.createOne(Chatroom, {
  path: "creator",
  select: "username",
});

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
