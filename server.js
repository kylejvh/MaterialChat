const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { socketConnected } = require("./utils/socketio");

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception. Server shutting down...");
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");
const server = require("http").Server(app);
const io = require("socket.io")(server, { serveClient: false });

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
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoDB connection successful");
  });

// Make socket.io available where needed.
io.on("connection", (socket) => {
  socketConnected(socket, io);
});

const PORT = process.env.PORT || 3100;

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`${err.name}: ${err.message}`);
  console.error("Unhandled rejection. Server shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
