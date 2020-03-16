//* Emitters
export const sendSocketChatroom = chatroom => {
  console.log(
    "----------------- SENDSOCKETCHATROOM TRIGGERED ----------------",
    chatroom
  );
};

//TODO: Reconnect?
//   //! write feature for handling reconnections here.

// socket.on("reconnect", attemptNumber => {
//   console.log("<reconnected, attempt ###>", attemptNumber);
// });

//! Send message -
// client should send message to server, server saves to db.
// Client appends message to client's own UI.

// Server broadcasts message to everyone else???

// server should save to DB.
//

//! Receive message

//! User Typing

//! User Stopped Typing...

//

// on load of dashboard, fetch all chatrooms...  //?DONE

// create chatroom       //? DONE
// save to db  //? DONE
// save to that clients list //?DONE
// emit to all connected users - new chatroom.

// //Socket.io Event Listeners - These were placed here to have a universal store - a place to listen for responses from the server, and send dispatches according the the response.
// if (!socket) {
//   socket = io("127.0.0.1:3000"); //! Prodution = Empty, DEV = 3000/3001

//   //
