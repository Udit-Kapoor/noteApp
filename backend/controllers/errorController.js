const AppError = require("../utils/appError");

const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error, res) => {
  // Operational , trusted error : send message to the client
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });

    // Programming or other unknown error : don't leak error details
  } else {
    // 1) Log error
    console.error(error);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else {
    // if (error.name == "CastError") error = handleCastErrorDB(error);
    // if (error.code == 11000) error = handleDuplicateFieldsDB(error);
    // if (error.name == "ValidationError") error = handleValidationErrorDB(error);
    // sendErrorProd(error, res);
    sendErrorDev(error,res);
  }
};
