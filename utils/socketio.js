const {
  onChatMessage,
  onJoinChatroom,
  onNewChatroomAdded,
  onChatroomDeleted,
  onUserLogin,
  onUserLogout,
  onUserTyping,
  onSocketDisconnect,
} = require("./socketHandlers");

exports.socketConnected = (socket, io) => {
  onUserLogin(socket, io);

  onChatMessage(socket, io);

  onJoinChatroom(socket, io);

  onSocketDisconnect(socket, io);

  onNewChatroomAdded(socket, io);

  onUserLogout(socket, io);

  onChatroomDeleted(socket, io);

  onUserTyping(socket, io);
};
