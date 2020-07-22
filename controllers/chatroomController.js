const Chatroom = require("./../models/chatroomModel");
const Messages = require("./../models/chatMessageModel");
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
  const chatroom = await Chatroom.findById(req.params.id).populate({
    path: "messages",
    select: "message",
    sort: -1,
    limit: 50,
  });

  if (!chatroom) {
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
exports.joinChatroom = factory.updateOne(Chatroom);
exports.deleteChatroom = catchAsync(async (req, res, next) => {
  const chatroom = await Chatroom.findByIdAndDelete(req.params.id);
  await Messages.deleteMany({
    sentInChatroom: req.params.id,
  });

  if (!chatroom) {
    return next(new AppError("No chatroom found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createChatroom = factory.createOne(Chatroom, {
  path: "creator",
  select: "username",
});

exports.getAllChatrooms = catchAsync(async (req, res, next) => {
  // Modify to search get all chatrooms of a namespace
  const chatrooms = await Chatroom.find();

  res.status(200).json({
    status: "success",
    results: chatrooms.length,
    data: {
      chatrooms,
    },
  });
});

exports.getChatroomUsersFromDB = async (chatroomId) => {
  const query = await Chatroom.findById(chatroomId).populate({
    path: "activeUsers",
    select: "username activeSocketId -currentChatroom",
  });

  if (!query) {
    return new AppError("No chatroom found with the specified ID", 404);
  }

  const { activeUsers } = query;
  return activeUsers;
};

// exports.createChatroom = async (chatroomName) => {
//   let query = await Chatroom.create(chatroomName);
//   query = await query
//     .populate({
//       path: "creator",
//       select: "username",
//     })
//     .execPopulate();

//   const newChatroom = await query;

//   if (!newChatroom) {
//     return new AppError("No chatroom could be created", 404);
//   }
// };
