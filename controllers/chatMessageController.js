const ChatMessage = require("./../models/chatMessageModel");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const io = require("./../server").io;

//! Factories... TEST ALL

exports.createMessage = factory.createOne(ChatMessage, {
  path: "sender",
  select: "username"
});
// exports.getAllMessages = factory.getAll(ChatMessage, true);
exports.getMessage = factory.getOne(ChatMessage);
exports.updateMessage = factory.updateOne(ChatMessage);
exports.deleteMessage = factory.deleteOne(ChatMessage);

//? WORKING VIA POSTMAN
// only fetch messages pertaining to the user's chatroom...
// this is wrong...

// Should call a useeffect fetch for this

exports.getAllMessages = catchAsync(async (req, res, next) => {
  //* Filter response if url param is present.
  //! NOT WORKING... Once it is, use factory version
  // ! review video 162 to implement factory if needed...
  let filter = {};
  if (req.params.chatroomId) filter = { chatroom: req.params.chatroomId };

  const messages = await ChatMessage.find(filter).populate("sender");

  // Populate the sender field so all messages have the corresponding sender?
  //! But you only want to get messages for a given chatroom...
  // How do you do this??

  //* You could fetch all messages for a chatroom using req.params.id???

  res.status(200).json({
    status: "success",
    results: messages.length,
    data: {
      messages
    }
  });

  //   // get chats from mongo collection...
  //   // socket.io should emit the chat messages
  //   // socket.emit('output', res)
  //   // Do I need to use router, or simply call the controller methods
  //   // inside of socket io code?

  //   //! Should probably think and sketch out architecture...
});

//! WORKING VIA POSTMAN, BUT YOU MUST FIX AUTH AND INCLUDE SENDER INFO....

//* POST - New messages should POST to /chatrooms/{chatroomId}/messages
//* UserId will come from logged in user.

//* GET - Same - should GET to /chatroom/{chatroomId}/messages
//* and GETchatroom should also fetch messages via populate?

exports.setChatMessageOriginIds = (req, res, next) => {
  // If no origin chatroom/sender is specified on body, take id from url
  // Via nested routes
  if (!req.body.sentInChatroom) req.body.sentInChatroom = req.params.id;
  if (!req.body.sender) req.body.sender = req.user._id;
  next();
};

//! Replaced with Factory Func
// exports.createMessage = catchAsync(async (req, res, next) => {
//   if (!req.body.chatroom) req.body.chatroom = req.params.id;
//   if (!req.body.sender) req.body.sender = req.user.id;

//   const newMessage = await ChatMessage.create({
//     message: req.body.message,
//     sender: req.body.sender
//   });

//   res.status(201).json({
//     status: "success",
//     data: {
//       newMessage
//     }
//   });
// });
