exports.socketConnected = (socket, io) => {
  //!TODO: on connect, set up io.use so when user logs in or is authed, add username and Id to socket object...

  socket.on("CHAT_MESSAGE_SENT", (msg) => {
    console.log("RECEIVED ON SERVER SIDE!!!", msg);
    socket.to(msg.sentInChatroom).emit("CHAT_MESSAGE_RECEIVED", msg);
  });

  socket.on(
    "CHATROOM_JOINED",
    ({ newChatroomId, prevChatroomId = null, user }) => {
      // If user is switching chatrooms, leave previous chatroom

      console.log(
        `NEW CHATROOM ID: ${newChatroomId} PREV CHATROOM ID: ${prevChatroomId}`
      );
      console.log(`USER OBJ PASSED TO SOCKETIO`, user);

      if (prevChatroomId) {
        console.log("----- PREVIOUS CHATROOM EXISTS -------", prevChatroomId);
        socket.leave(prevChatroomId);

        io.to(prevChatroomId).emit("CHATROOM_USERLIST_UPDATED", {
          user,
          remove: true,
        });
      }

      // Put socket in new chatroom
      socket.join(newChatroomId);

      //! Problem: If a new socket joins, they don't get a full list of users connected...
      const room = io.sockets.adapter.rooms[newChatroomId];
      console.log("sockets in room?", io.sockets.adapter);
      // Send cients in new chatroom a list of chatroom users...
      io.to(newChatroomId).emit("CHATROOM_USERLIST_UPDATED", { user });
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
