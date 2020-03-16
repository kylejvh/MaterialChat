const express = require("express");

const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const path = require("path");
const chatroomRouter = require("./routes/chatroomRoutes");
const chatMessageRouter = require("./routes/chatMessageRoutes");
const userRouter = require("./routes/userRoutes");

//* 1. GLOBAL MIDDLEWARES

//TODO: Figure out how you need to serve this in production with React
// // Server static assets in production
// if (process.env.NODE_ENV === "production") {
//   // Set static folder
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

const app = express();

var whitelist = [
  "http://localhost:3000",
  "http://192.168.1.181:3000",
  "https://kjvh-materialchat.herokuapp.com/"
];
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

//!  IMPLEMENT CORS - ADJUST AS NEEDED FOR PRODUCTION
// Currently set to all domains - Access-Control-Allow-Origin *
app.use(
  cors(
    corsOptions
    // origin: "http://localhost:3000",
    //     credentials: true
    //   })
  )
);

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true
//   })
// );

// Handle CORS pre-flight phase
// app.options("*", cors(corsOptions));
// Set security HTTP headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//TODO: You may need to change this for a chat application...
// Limit a connection to 100 requests per hour
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP.\n Please try again in an hour."
});
app.use("/api", limiter);

// Body parser, reads data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// TODO: edit whitelist
// Prevent parameter pollution with whitelist exceptions
app.use(
  hpp({
    whitelist: ["duration"]
  })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//* 2. MOUNTING ROUTERS
// app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chatrooms", chatroomRouter);
app.use("/api/v1/messages", chatMessageRouter);

module.exports = app;

//! Questions to answer...
//! HOW DO I INITIALIZE AND IMPORT MY SOCKETIO SERVER...
//! How do I call controller methods with socketio and pass data?
//
