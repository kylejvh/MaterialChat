let app = require("express")();
let http = require("http").createServer(app);
let io = require("socket.io")(http);

let serverSideUsers = []; //! Make this immutable when done.
let chatrooms = []; //! Make this immutable when done.

// EXAMPLE OBJ              serverSideUsers: { username: '', clientId: '', currentChatroom: ''  }

io.on("connection", socket => {
  console.log(socket.id, "all connections");

  socket.on("requestUsername", user => {
    console.log(`New user: ${JSON.stringify(user)} is trying to connect`);
    if (Object.values(serverSideUsers).includes(user.username)) {
      // map instead now???
      user.isActive = false;
      io.emit("userExists", user);
      console.log("name taken!");
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
      io.emit("userSet", serverSideUsers);
    }

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

  socket.on("userLogout", function(user) {
    if (Object.values(serverSideUsers).includes(user.username)) {
      //! Remove user and clientId from serverside obj.
    }

    io.emit("userLogoutSuccess", user);
    socket.disconnect();
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

  //! handling rooms
  // on username create, copy clientID to server object along with name.
  // when the user joins a chatroom, change obj to reflect that?
  //

  socket.on("joinChatroom", data => {
    console.log(data.chatroom, "just logging data");
    console.log(data, "whats this");

    serverSideUsers.map(item => {
      if (item.username === data.username) {
        item.currentChatroom = data.chatroom;
      }
    });

    console.log("!!! BUT DID THIS WORK", serverSideUsers);
    io.emit("joinChatroomSuccess", serverSideUsers);
    // next:
    //! ADD CHECKS TO PREVENT DUPLICATE POSTS OF JOINING CHATROOMS!!! -

    // io.in(data.chatroom).clients((err, clients) => { //? FIND OUT WHAT THIS CODE DOES!
    //   console.log(clients, "testing: show clients in general");

    // serverSideUsers.map(item => {
    //   let currentChatroomUserList = [];
    //   if (item.currentChatroom === data.chatroom) {
    //     currentChatroomUserList.push(item.username);

    //     io.emit("usersInChatroom", currentChatroomUserList);
    //   }
    // });

    // clients will be array of socket ids , currently available in given room
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
