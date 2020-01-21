const express = require("express");
const app = express();
const server = require("http").Server(app); //! PROD
const io = require("socket.io")(server);

// let app = require("express")();
// let http = require("http").createServer(app); //! DEV
// let io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/../../build")); //! Production build

let serverSideUsers = [];
let chatrooms = ["General"];

io.on("connection", socket => {
  console.log(socket.id, "all connections");

  //! How should I handle disconnects?

  // If I remove the user's record from server,
  // someone else can log in and assume their identity...

  // socket.on("disconnect", reason => {
  //   // On disconnect, remove user's record
  //   console.log(serverSideUsers.find(item => item.clientId === socket.id));
  //   console.log(reason);
  //   // if (reason === )

  //   // if (reason === 'io server disconnect') {
  //   //   // the disconnection was initiated by the server, you need to reconnect manually
  //   //   socket.connect();
  //   // }

  //   // else the socket will automatically try to reconnect

  //   console.log(socket.id, "this socket disconnected");
  // });

  // socket.on("disconnect", reason => {
  //   // if (reason === 'io server disconnect') {
  //   //   // the disconnection was initiated by the server, you need to reconnect manually
  //   //   socket.connect();
  //   // }

  //   // else the socket will automatically try to reconnect
  //   if (reason === "io client disconnect") {
  //     console.log(socket.id, "this socket disconnected");
  //   }
  //   if (reason === "io server disconnect") {
  //     // the disconnection was initiated by the server, you need to reconnect manually
  //     console.log(socket.id, "server disconnect...");
  //   }
  // });

  socket.on("requestUsername", user => {
    console.log(`New user: "${user.username}" is trying to connect.`);

    if (serverSideUsers.length === 0) {
      serverSideUsers = [
        ...serverSideUsers,
        {
          username: user.username,
          clientId: socket.id,
          currentChatroom: ""
        }
      ];
      console.log(`First User "${user.username}" has logged in.`);
      socket.emit("userSet", user);
    } else if (serverSideUsers.length > 0) {
      if (
        serverSideUsers.find(
          item => item.username.toLowerCase() === user.username.toLowerCase()
        )
      ) {
        console.log("Username is taken.");
        return socket.emit("userExists");
      }
      serverSideUsers = [
        ...serverSideUsers,
        {
          username: user.username,
          clientId: socket.id,
          currentChatroom: ""
        }
      ];
      console.log(`User "${user.username}" is not taken, logged in.`);
      return socket.emit("userSet", user);
    }
  });

  socket.on("userLogout", data => {
    // You need to handle  removing the socket from the rooms it's in,
    // then updating the serversideuser obj,
    // then broadcasting new usercount,
    // then updating the user's frontend.

    if (data.currentChatroom !== "") {
      let previousChatroomUsers = [];
      socket.leave(data.currentChatroom);

      serverSideUsers = serverSideUsers.filter(
        // Remove record of user from server...
        item => item.username !== data.username
      );
      console.log("you shouldnt be recorded anymore", serverSideUsers);

      previousChatroomUsers = serverSideUsers
        .filter(item => item.currentChatroom === data.currentChatroom)
        .map(item => item.username);
      console.log("people in chatroom you left", previousChatroomUsers);
      io.to(data.currentChatroom).emit(
        "currentChatroomUsers",
        previousChatroomUsers
      );
      socket.emit("userLogoutSuccess", data);
    } else {
      console.log("should only trigger if not in room...");
      serverSideUsers = serverSideUsers.filter(
        item => item.username !== data.username
      );
      socket.emit("userLogoutSuccess", data);
    }
    console.log(`User "${data.username}" has logged out.`);
  });

  //? to private message someone, for future development...
  // io.on("connection", function(socket) {
  //   socket.on("say to someone", function(id, msg) {
  //     socket.broadcast.to(id).emit("my message", msg);
  //   });
  // });

  // Do conditional check to see if user is unique.

  // you need functionality to check if a username is taken.
  // this would be some type of list comparison.
  // and would require io.emit

  socket.on("requestNewChatroom", data => {
    console.log("new chatroom requested!");
    if (
      chatrooms.find(
        item => item.toLowerCase() === data.chatroomName.toLowerCase()
      )
    ) {
      console.log("Chatroom already exists.");
      return socket.emit("chatroomExists");
    } else {
      console.log(`Chatroom ${JSON.stringify(data.chatroomName)} created!`);
      chatrooms = [...chatrooms, data.chatroomName];

      // This updates all connected clients with the new chatroom.
      io.emit("chatroomListUpdate", data);

      // This will update the State of user who created the chatroom.
      return socket.emit("newChatroomCreated");
    }
  });

  socket.on("chat message", msg => {
    console.log("message: " + JSON.stringify(msg));
    io.emit("chat message", msg);
  });

  socket.on("typing", typingData => {
    socket.broadcast.emit("notifyTyping", typingData);
  });

  //when soemone stops typing

  socket.on("stopTyping", typingData => {
    socket.broadcast.emit("notifyStopTyping", typingData);
  });

  socket.on("error", function(err) {
    console.log("received error from client");
    console.log(err);
  });

  socket.on("joinChatroom", data => {
    //! Full Logic
    console.log(serverSideUsers);

    serverSideUsers.map(item => {
      let newChatroomUsers = [];
      let previousChatroomUsers = [];
      // Handle a chatroom change
      if (item.username.toLowerCase() === data.username.toLowerCase()) {
        if (item.currentChatroom !== "") {
          // If user is switching chatrooms...
          const previousChatroom = item.currentChatroom; // Store previous chatroom
          console.log("youre leaving a room");
          socket.leave(previousChatroom); // Leave previous chatroom on server

          item.currentChatroom = data.chatroom; // Update serverside list - Set user's chatroom to the requested chatroom

          previousChatroomUsers = serverSideUsers
            .filter(item => item.currentChatroom === previousChatroom) // Get list of usernames currently in previous chatroom.
            .map(item => item.username);

          console.log("previous chatroom users:", previousChatroomUsers);

          io.to(previousChatroom).emit(
            "currentChatroomUsers",
            previousChatroomUsers
          ); // Send ONLY clients in PREVIOUS CHATROOM a list of chatroom users...

          /*


      Spacer Block

          */

          socket.join(data.chatroom); // Join new chatroom on server

          newChatroomUsers = serverSideUsers
            .filter(item => item.currentChatroom === data.chatroom) // Get list of usernames currently in REQUESTED chatroom.
            .map(item => item.username);

          console.log("current chatroom users:", newChatroomUsers);

          io.to(data.chatroom).emit("currentChatroomUsers", newChatroomUsers); // Send cients in new chatroom a list of chatroom users...

          socket.emit("joinChatroomSuccess", data); // Tell client's frontend to update to move to new chatroom
        } else {
          // handle joining initial chatroom
          console.log(`First chatroom, joining ${data.chatroom}`);
          item.currentChatroom = data.chatroom; // Update serverside list - Set user's chatroom to the requested chatroom

          socket.join(data.chatroom); // Join new chatroom on server

          newChatroomUsers = serverSideUsers
            .filter(item => item.currentChatroom === data.chatroom) // Get list of usernames currently in REQUESTED chatroom.
            .map(item => item.username);

          io.to(data.chatroom).emit(
            // Send clients in new chatroom a list of chatroom users...
            "currentChatroomUsers",
            newChatroomUsers
          );

          socket.emit("joinChatroomSuccess", data); // Tell client's frontend to update to move to new chatroom
        }
      }
    });
  });
});

//! Production
server.listen(PORT, err => {
  if (err) throw err;
  console.log(`Listening on ${PORT}`);
});

// //! DEV
// http.listen(3001, function(err) {
//   if (err) throw err;
//   console.log("listening on *:3001");
// });
