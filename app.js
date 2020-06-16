const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const path = require("path");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const chatroomRouter = require("./routes/chatroomRoutes");
const chatMessageRouter = require("./routes/chatMessageRoutes");
const userRouter = require("./routes/userRoutes");
const premiumRouter = require("./routes/premiumRoutes");

const app = express();

//* 1. GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit a connection to 1000 requests per hour
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP.\n Please try again in an hour.",
});
app.use("/api", limiter);

// Body parser, reads data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution with whitelist exceptions
app.use(
  hpp({
    whitelist: ["duration"],
  })
);

app.use(compression());

//* 2. MOUNTING ROUTERS
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chatrooms", chatroomRouter);
app.use("/api/v1/messages", chatMessageRouter);
app.use("/api/v1/premium", premiumRouter);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build/index.html"), function (
      err
    ) {
      if (err) {
        res.status(500).send(err);
      }
    });
  });
}

// Handle undefined routes
//! Order dependent! Must be placed before globalErrorHandler.
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on the server.`, 404));
});

// Error Middleware
app.use(globalErrorHandler);

module.exports = app;
