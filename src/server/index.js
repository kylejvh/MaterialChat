let app = require("express")();
let http = require("http").createServer(app);
let io = require("socket.io")(http);

let serverSideUsers = []; //! Make this immutable when done.
let chatrooms = []; //! Make this immutable when done.

// EXAMPLE OBJ              serverSideUsers: [{ username: '', clientId: '', currentChatroom: ''  }]

io.on("connection", socket => {
  console.log(socket.id, "all connections");

  socket.on("requestUsername", user => {
    console.log(`New user: ${JSON.stringify(user)} is trying to connect`);

    serverSideUsers.map(item => {
      if (item.username === user.username) {
        console.log("name taken!");
        io.emit("userExists", user);
      } else {
        serverSideUsers = [
          ...serverSideUsers,
          {
            username: user.username,
            clientId: socket.id,
            currentChatroom: ""
          }
        ];
        // serverSideUsers.username = user.username;
        // serverSideUsers.clientId = socket.id;
        console.log(serverSideUsers, "current ss object");
        console.log(`User ${JSON.stringify(user.username)} has logged in`);
        io.emit("userSet", user);
      }
    });

    // put this in if

    // if (serverSideUsers.hasOwnProperty(user.username)) {
    //   user.isActive = false;
    //   io.emit("userExists", user);
    //   return console.log("name taken!");
    // } else {
    //   user.isActive = true; // probably need to store isactive on backend too.
    //   console.log(`User ${JSON.stringify(user.username)} has logged in`);
    //   usernames.push(user.username.toUpperCase());
    //   io.emit("userSet", user);
    // }

    // make an object that contains all client ids and usernames
  });

  socket.on("userLogout", data => {
    // You need to handle  removing the socket from the rooms it's in,
    // then updating the serversideuser obj,
    // then broadcasting new usercount,
    // then updating the user's frontend.

    if (data.currentChatroom !== "") {
      let previousChatroomUsers = [];
      socket.leave(data.currentChatroom); //! check for error if chatroom is empty....

      previousChatroomUsers = serverSideUsers
        .filter(item => item.currentChatroom === data.currentChatroom)
        .map(item => item.username);

      io.to(data.currentChatroom).emit(
        "currentChatroomUsers",
        previousChatroomUsers
      );
    }

    serverSideUsers = serverSideUsers.filter(
      item => item.username !== data.username
    );

    console.log("does ss users show deleted?", serverSideUsers);

    io.emit("userLogoutSuccess", data);
  });

  // io.of('/').in('general').clients((error, clients) => {
  //   if (error) throw error;
  //   console.log(clients);

  //! to private message someone
  io.on("connection", function(socket) {
    socket.on("say to someone", function(id, msg) {
      socket.broadcast.to(id).emit("my message", msg);
    });
  });

  // Do conditional check to see if user is unique.

  // you need functionality to check if a username is taken.
  // this would be some type of list comparison.
  // and would require io.emit

  socket.on("requestNewChatroom", function(chatroom) {
    console.log("new chatroom requested!");
    if (chatrooms.includes(chatroom.chatroomName)) {
      io.emit("chatroomExists", chatroom);
      return console.log("chatroom name exists!");
    } else {
      console.log(`Chatroom ${JSON.stringify(chatroom.chatroomName)} created!`);
      chatrooms.push(chatroom.chatroomName.toUpperCase());

      io.emit("createChatroom", chatroom);
    }
  });

  socket.on("chat message", function(msg) {
    console.log("message: " + JSON.stringify(msg));
    io.emit("chat message", msg);
  });

  socket.on("typing", function(typingData) {
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
    serverSideUsers.map(item => {
      let newChatroomUsers = [];
      let previousChatroomUsers = [];
      // Handle a chatroom change
      if (item.username === data.username) {
        if (item.currentChatroom !== "") {
          // If user is switching chatrooms...
          const previousChatroom = item.currentChatroom; // Store previous chatroom

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

          io.emit("joinChatroomSuccess", data); // Tell client's frontend to update to move to new chatroom
        } else {
          // handle joining initial chatroom

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

          io.emit("joinChatroomSuccess", data); // Tell client's frontend to update to move to new chatroom
        }
      }
    });
  });

  // socket
  //   .of("/")
  //   .in("general")
  //   .clients((err, clients) => {
  //     console.log(clients, "test2"); // an array of socket ids
  //
  //     // io.to(room?).emit('Someone joined');
  //   });

  //! show users in current room

  // socket.on("connection", client => {
  //   socket
  //     .of("/")
  //     .in("general")
  //     .clients((err, clients) => {
  //       console.log(clients); // an array of socket ids
  //       io.emit("usersInChatroom", clients);
  //     });
  // });
});

http.listen(3001, function(err) {
  if (err) throw err;
  console.log("listening on *:3001");
});
