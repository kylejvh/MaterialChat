const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// const socketManager = require("./SocketManager");
const app = require("./app");
const server = require("http").Server(app);
const io = require("socket.io")(server);

// to export:
// const io = (exports.io = require("socket.io")(server));

// Set up mongoDB connection

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log("mongoDB connection successful"));

// Start server

// Make socket.io available where needed.
io.on("connection", function(socket) {
  socket.on("SOCKET_ADDED_CHATROOM", chatroom => {
    socket.broadcast.emit("SOCKET_ADDED_CHATROOM", chatroom);
  });

  //* Emit a sent message to every other connected user.
  socket.on("CHAT_MESSAGE_SENT", function(msg) {
    socket.broadcast.emit("CHAT_MESSAGE_RECEIVED", msg);
  });

  socket.on("TYPING", function(data) {
    if (data.typing) {
      socket.broadcast.emit("TYPING", data);
    } else {
      socket.broadcast.emit("TYPING", data);
    }
  });
});

const PORT = process.env.PORT || 3100;

server.listen(PORT, err => {
  if (err) throw err;
  console.log(`App running on port ${PORT}`);
});
