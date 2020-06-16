const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception. Server shutting down...");
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");
const server = require("http").Server(app);
const io = require("socket.io")(server);

// to export:
// const io = (exports.io = require("socket.io")(server));

// Set up mongoDB connection
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoDB connection successful"));

// Make socket.io available where needed.
io.on("connection", function (socket) {
  socket.on("SOCKET_JOINED_CHATROOM", (data) => {
    // If user is switching chatrooms, leave previous chatroom

    console.log(data, "passed chatroom");
    if (data.prevChatroom) {
      console.log("----- PREVIOUS CHATROOM EXISTS -------", data.prevChatroom);
      socket.leave(data.prevChatroom);

      io.to(data.prevChatroom).emit("CHATROOM_USERLIST_UPDATED", {
        user: data.user,
        remove: true,
      });
    }

    //* continue with socket rooms
    //?DONE Change messaging functionality to emit to only the rooms needed
    //* Change/implement user list updating to only the rooms needed
    //* Change/fix typing functionality to work for only the rooms needed...

    //TODO: To get users in previous or current chatroom, you could
    //TODO: either map sockets to users and perform array methods like filter, or...

    // Update userlist of previous chatroom - Set user's chatroom to the requested chatroom
    //
    // previousChatroomUsers = serverSideUsers
    //   .filter(item => item.currentChatroom === previousChatroom) // Get list of usernames currently in previous chatroom.
    //   .map(item => item.username);
    // Send ONLY clients in PREVIOUS CHATROOM a list of chatroom users...

    // Put socket in new chatroom
    socket.join(data.id);

    // Send cients in new chatroom a list of chatroom users...
    io.to(data.id).emit("CHATROOM_USERLIST_UPDATED", data.user);
  });

  socket.on("SOCKET_ADDED_CHATROOM", (chatroom) => {
    socket.broadcast.emit("SOCKET_ADDED_CHATROOM", chatroom);
  });

  // Emit a sent message to every other connected user.
  socket.on("CHAT_MESSAGE_SENT", (msg) => {
    socket.to(msg.sentInChatroom).emit("CHAT_MESSAGE_RECEIVED", msg);
  });

  // Append chatroom to data...
  //TODO: Debounce or rewrite client functions, fix reducer filter...
  socket.on("TYPING", (data) => {
    socket.to(data.chatroom).emit("TYPING", data);
  });

  //TODO: Handle a user logging out - Remove socket from chatroom and disconnect socket.
  socket.on("LOGOUT", (data) => {
    // You need to handle  removing the socket from the rooms it's in,
    // then updating the serversideuser obj,
    // then broadcasting new usercount,
    // then updating the user's frontend.

    if (data.currentChatroom !== "") {
      let previousChatroomUsers = [];
      socket.leave(data.currentChatroom);

      io.to(data.currentChatroom).emit(
        "currentChatroomUsers",
        previousChatroomUsers
      );
    }
  });

  socket.on("disconnect", (data) => {
    console.log("--- DISCONNECT EVENT ---", data);
    // You need to handle  removing the socket from the rooms it's in,
    // then update DB to remove currentChatroom...
    // then broadcasting new usercount,
    // then updating the user's frontend.

    if (data.currentChatroom !== "") {
      let previousChatroomUsers = [];
      socket.leave(data.currentChatroom);

      io.to(data.currentChatroom).emit(
        "currentChatroomUsers",
        previousChatroomUsers
      );
    }
  });
});

const PORT = process.env.PORT || 3100;

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`${err.name}: ${err.message}`);
  console.error("Unhandled rejection. Server shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
