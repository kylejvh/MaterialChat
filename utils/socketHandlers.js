const {
  setDBActiveSocketId,
  updateDBActiveChatroom,
} = require("../controllers/userController");
const { getChatroomUsersFromDB } = require("../controllers/chatroomController");
const { createMessage } = require("../controllers/chatMessageController");

// Realtime events will be handled by socket.io, and then processed by DB, instead of by Express routes

// Finds user by id in DB, and sets socket.id as active socket on user document
exports.onUserLogin = (socket, io) =>
  socket.on("USER_LOGGED_IN", (userId) =>
    setDBActiveSocketId(userId, socket.id)
  );

exports.onChatMessage = (socket, io) =>
  socket.on(
    "CHAT_MESSAGE_SENT",
    async ({ sender, message, sentChatroomId }) => {
      const newDBMessage = await createMessage({
        sender,
        message,
        sentInChatroom: sentChatroomId,
      });

      // Current implementation will broadcast message to everyone, including the origin socket
      // This is to ensure everyone has synchronized access to all fields from the DB.
      // In the future, you may need to generate a unique ID for messages on the clientside...
      /// ... to support instant rendering of messages on the client of the origin socket.
      io.to(sentChatroomId).emit("CHAT_MESSAGE_RECEIVED", newDBMessage);
    }
  );

exports.onNewChatroomAdded = (socket, io) =>
  socket.on("SOCKET_ADDED_CHATROOM", (chatroom) => {
    // createChatroom(chatroomName);

    io.emit("SOCKET_ADDED_CHATROOM", chatroom);
  });

exports.onJoinChatroom = (socket, io) =>
  socket.on(
    "CHATROOM_JOINED",
    ({ newChatroomId, prevChatroomId = null, userId }) => {
      updateDBActiveChatroom(newChatroomId, userId);

      // Remove socket from previous room, update DB, and update previous chatroom clients
      if (prevChatroomId) {
        socket.leave(prevChatroomId, (error) => {
          io.in(prevChatroomId).clients(async (error, clients) => {
            // Verify user list data is not stale by comparing DB list and socketio room socket list
            const previousChatroomUserListFromDB = await getChatroomUsersFromDB(
              prevChatroomId
            );

            const updatedUserList = previousChatroomUserListFromDB.filter(
              (user) => clients.includes(user.activeSocketId)
            );

            io.to(prevChatroomId).emit(
              "CHATROOM_USERLIST_UPDATED",
              updatedUserList
            );
          });
        });
      }

      // Put socket in new room, update DB, and update client user lists
      socket.join(newChatroomId, (error) => {
        io.in(newChatroomId).clients(async (error, clients) => {
          const newChatroomUserListFromDB = await getChatroomUsersFromDB(
            newChatroomId
          );

          const updatedUserList = newChatroomUserListFromDB.filter((user) =>
            clients.includes(user.activeSocketId)
          );

          io.to(newChatroomId).emit(
            "CHATROOM_USERLIST_UPDATED",
            updatedUserList
          );
        });
      });
    }
  );

exports.onChatroomDeleted = (socket, io) =>
  socket.on("CHATROOM_DELETED", (chatroomId) => {
    // emit a redict and notification to all connected users?

    io.to(chatroomId).emit("");
  });

exports.onUserTyping = (socket, io) =>
  socket.on("TYPING", (data) => {
    socket.to(data.chatroom).emit("TYPING", data);
  });

exports.onSocketDisconnect = (socket, io) =>
  socket.on("disconnect", (reason) => {
    console.log(reason);

    if (reason === "server namespace disconnect") {
      return;
    }
  });

// Remove socket from any rooms it's in, updates DB, and updates the user lists.
exports.onUserLogout = (socket, io) =>
  socket.on("LOGOUT", ({ chatroomId, userId }) => {
    setDBActiveSocketId(userId, "inactive");

    if (chatroomId) {
      socket.leave(chatroomId, (error) => {
        updateDBActiveChatroom(null, userId);

        io.in(chatroomId).clients(async (error, clients) => {
          const newChatroomUserListFromDB = await getChatroomUsersFromDB(
            chatroomId
          );

          const updatedUserList = newChatroomUserListFromDB.filter((user) =>
            clients.includes(user.activeSocketId)
          );

          io.to(chatroomId).emit("CHATROOM_USERLIST_UPDATED", updatedUserList);
        });
      });
    }
  });
