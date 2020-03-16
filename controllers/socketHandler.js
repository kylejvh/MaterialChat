// You could create a socket middleware and have it run on each controller method call.
// or you could import the socket function needed on
// each individual controller method...

//! Try the middleware implementation...
//! Message is sent, socket is triggered and sends message, message is passed off
//! to post request to server, to save msg to DB

// const io = require("./../server").io;
// const catchAsync = require("./../utils/catchAsync");

// exports.emitMessage = (req, res, next) => {
//   // socket.on("CHAT_MESSAGE_SENT", msg => {
//   //   console.log("message: " + JSON.stringify(msg));
//   //   io.emit("chat message", msg);
//   // });
//   next();
// };

// exports.emitChatroom = io => async (req, res, next) => {
//   console.log(io.body, "**************** IO LOGGED **************");
//   await io.on("ADD_CHATROOM_SUCCEEDED", chatroom => {
//     console.log("******* chatroom: " + JSON.stringify(chatroom));
//     io.broadcast.emit("CHATROOM_ADDED", chatroom);
//   });
//   next();
// };
