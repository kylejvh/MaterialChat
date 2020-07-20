// When user is loaded, pass username and userid to server
//? What is the best way to save this information to the server for easy access?

// Then, whenever the user joins a server, emit an updated list of users to that socket room. This must be tracked on the server side, because the client state does not fully persist.

// When a user leaves, also send a fully updated list.

const onChatMessage = require("./socketio-server/onChatMessage");
// let socketIoLocals = require("../server").socketIoLocals;

exports.socketConnected = (socket, io) => {
  // Using array, improve when able
  let socketIoLocals = [];

  socket.on("USER_LOGGED_IN", (userData) => {
    return socketIoLocals.push(userData);
  });
  console.log("LOCALS SET??", socketIoLocals);

  onChatMessage(socket, io);

  socket.on(
    "CHATROOM_JOINED",
    ({ newChatroomId, prevChatroomId = null, user }) => {
      // Hit DB for user lists

      console.log("Current working array:", socketIoLocals);
      // If user is switching chatrooms, leave previous chatroom
      console.log(
        `NEW CHATROOM ID: ${newChatroomId} PREV CHATROOM ID: ${prevChatroomId}`
      );

      if (prevChatroomId) {
        console.log("----- PREVIOUS CHATROOM EXISTS -------", prevChatroomId);
        socket.leave(prevChatroomId);

        io.in(prevChatroomId).clients((error, clients) => {
          console.log("prev chatroom clients", clients);
          const previousChatroomUserList = socketIoLocals.filter((user) =>
            clients.includes(user.clientSocketId)
          );

          io.to(prevChatroomId).emit(
            "CHATROOM_USERLIST_UPDATED",
            previousChatroomUserList
          );
          console.log("prevChatroom user list", previousChatroomUserList);
        });
      }

      // Put socket in new chatroom
      socket.join(newChatroomId);

      io.in(newChatroomId).clients((error, clients) => {
        console.log("new chatroom clients", clients);
        console.log("current locals inside newchatroom", socketIoLocals);

        const newChatroomUserList = socketIoLocals.filter((user) =>
          clients.includes(user.clientSocketId)
        );
        console.log("New chatroom list", newChatroomUserList);
        // Send cients in new chatroom a list of chatroom users...

        io.to(newChatroomId).emit(
          "CHATROOM_USERLIST_UPDATED",
          newChatroomUserList
        );
      });

      //! Problem: If a new socket joins, they don't get a full list of users connected...

      console.log("Rooms this socket is in>", Object.keys(socket.rooms));
    }
  );

  socket.on("SOCKET_ADDED_CHATROOM", (chatroom) => {
    io.emit("SOCKET_ADDED_CHATROOM", chatroom);
  });

  // // Emit a sent message to every other connected user.
  // socket.on("CHAT_MESSAGE_SENT", (msg) => {
  //   console.log("RECEIVED ON SERVER SIDE!!!", msg);
  //   socket.to(msg.sentInChatroom).emit("CHAT_MESSAGE_RECEIVED", msg);
  // });

  // Append chatroom to data...
  socket.on("TYPING", (data) => {
    socket.to(data.chatroom).emit("TYPING", data);
  });

  socket.on("LOGOUT", (data) => {
    if (data.currentChatroom !== "") {
      let previousChatroomUsers = [];
      socket.leave(data.currentChatroom);

      io.to(data.currentChatroom).emit(
        "currentChatroomUsers",
        previousChatroomUsers
      );
    }
  });

  socket.on("CHATROOM_DELETED", (chatroomId) => {
    // emit a redict and notification to all connected users?
    // socket.to(chatroomId)
  });

  socket.on("disconnect", (data) => {
    console.log("--- DISCONNECT EVENT ---", data);
    if (data.currentChatroom !== "") {
      let previousChatroomUsers = [];
      socket.leave(data.currentChatroom);

      io.to(data.currentChatroom).emit(
        "currentChatroomUsers",
        previousChatroomUsers
      );
    }
  });
};
