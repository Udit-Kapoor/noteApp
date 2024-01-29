const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const db = require("./db/db");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

require("dotenv").config();

const app = express();

// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

app.use(hpp());

app.use(cors());

// Restrict all routes to only 100 requests per IP address every 1o minutes
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 requests per IP
});
app.use(limiter);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitizers against XSS
app.use(xss());

// ROUTES
app.get("/", (req, res) => {
  res.send("Server started successfully");
});

app.use("/", require("./routes/route"));

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error middleware
app.use(globalErrorHandler);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`App running ${process.env.NODE_ENV} on port ${PORT}...`);
});

process.on("unhandledRejection", (err) => {
  console.error(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
