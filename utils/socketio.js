// When user is loaded, pass username and userid to server
//? What is the best way to save this information to the server for easy access?

// Then, whenever the user joins a server, emit an updated list of users to that socket room. This must be tracked on the server side, because the client state does not fully persist.

// When a user leaves, also send a fully updated list.

exports.socketConnected = (socket, io) => {
  const socketIoLocals = new WeakMap();
  const locals = { socketId: socket.id };
  socketIoLocals.set(socket, locals);
  console.log("LOCALS SET??", socketIoLocals.get(socket));

  socket.on("SET_SOCKET", ({ username, userId }) => {
    socket._user = { username, userId };

    console.log("INSIDE HERE???");
    console.log("Socket user set?", socket._user);
  });

  // io.use((socket, next) => {
  //   // const locals = { username, userId };
  //   // socketIOlocals.set(socket, locals);

  //   console.log("SETTING USER INFO...");
  //   // console.log("WeakmapTesting2", socketIOlocals.get(socket));
  //   next();
  //   // }
  //   // socket.username = username;
  //   // socket.userId = userId;
  // });
  // });
  //!TODO: on connect, set up io.use so when user logs in or is authed, add username and Id to socket object...

  socket.on("CHAT_MESSAGE_SENT", (msg) => {
    console.log("RECEIVED ON SERVER SIDE!!!", msg);
    socket.to(msg.sentInChatroom).emit("CHAT_MESSAGE_RECEIVED", msg);
  });

  socket.on(
    "CHATROOM_JOINED",
    ({ newChatroomId, prevChatroomId = null, user }) => {
      // If user is switching chatrooms, leave previous chatroom

      // var clients = io.sockets.adapter.rooms[newChatroomId].sockets;

      // console.log("connected clients", clients);

      console.log("socket joined look for username", socket._user);
      console.log("Does resetting ID work???", socket.id);

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
      const usersInRoom = io.sockets.adapter.rooms[newChatroomId];
      console.log("USERS should be in this room", usersInRoom);
      // console.log("sockets in room?", io.sockets.adapter);

      // Object.keys(usersInRoom).forEach(socket => )

      console.log("Rooms this socket is in>", Object.keys(socket.rooms));
      // console.log("sockets in room?", io.sockets.adapter.rooms);

      // Send cients in new chatroom a list of chatroom users...
      // io.to(newChatroomId).emit("CHATROOM_USERLIST_UPDATED");
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

  exports.socketIoLocals = socketIoLocals;
};
