//*
//*
//*
//*
//*
//*
//* EVENT EMITTERS DOWN BELOW...
//*

export const sendSocketChatroom = chatroom => {
  console.log(
    "----------------- SENDSOCKETCHATROOM TRIGGERED ----------------",
    chatroom
  );
  //   socket.emit("ADD_CHATROOM_SUCCEEDED", chatroom);
};

export const sendSocketMessage = msg => {
  console.log(
    "----------------- sendSocketMessage TRIGGERED ----------------",
    msg
  );

  //   socket.emit("CHAT_MESSAGE_SENT", msg);
};

export const emitTyping = value => {
  console.log("----- YOU TYPED -----", value);
  //   socket.emit("notifyTyping", value);
};

export const emitStopTyping = value => {
  console.log("----- YOU STOPPED TYPING -----");
  //   socket.emit("notifyStopTyping", value);
};
