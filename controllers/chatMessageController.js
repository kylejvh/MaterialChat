const ChatMessage = require("./../models/chatMessageModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");

// exports.createMessage = factory.createOne(ChatMessage, {
//   path: "sender",
//   select: "username",
// });

exports.createMessage = async (msgData) => {
  let newMessageDoc = await ChatMessage.create(msgData);
  newMessageDoc = await newMessageDoc
    .populate({
      path: "sender",
      select: "username photo",
    })
    .execPopulate();

  const newMessage = await newMessageDoc;

  if (!newMessage) {
    return new AppError("No document received", 404);
  }

  return newMessage;
};
// exports.getAllMessages = factory.getAll(ChatMessage, true);
exports.getMessage = factory.getOne(ChatMessage);
exports.updateMessage = factory.updateOne(ChatMessage);
exports.deleteMessage = factory.deleteOne(ChatMessage);

//? WORKING VIA POSTMAN
exports.getAllMessages = catchAsync(async (req, res, next) => {
  //* Filter response if url param is present.
  let filter = {};
  if (req.params.chatroomId) filter = { chatroom: req.params.chatroomId };

  const messages = await ChatMessage.find(filter).populate("sender");

  res.status(200).json({
    status: "success",
    results: messages.length,
    data: {
      messages,
    },
  });
});

exports.setChatMessageOriginIds = (req, res, next) => {
  // If no origin chatroom/sender is specified on body, take id from url
  // Via nested routes
  if (!req.body.sentInChatroom) req.body.sentInChatroom = req.params.id;
  if (!req.body.sender) req.body.sender = req.user._id;
  next();
};
