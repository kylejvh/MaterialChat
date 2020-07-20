const chatMessageController = require("../../controllers/chatMessageController");
//TODO: Convert realtime events to this style - use socket.io first, and the controllers inside....
//TODO: ... for Chat messages, new chatroom creation, AYNTHING realtime....

module.exports = (socket, io) =>
  socket.on("CHAT_MESSAGE_SENT", (msgData) => {
    //TODO: Run code in sentOriginIDs,
    // Pass Data: {
    // message.data
    // }

    chatMessageController.createMessage(msgData, {
      path: "sender",
      select: "username",
    });

    socket.to(msgData.sentInChatroom).emit("CHAT_MESSAGE_RECEIVED", msgData);
  });
