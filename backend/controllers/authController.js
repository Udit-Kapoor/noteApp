const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require("bcrypt");

// utils
const userServices = require("../db/user.services");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // for https only
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError("You must provide an email and a password.", 400));
  }
  const existingUser = await userServices.findUserByEmail(email);
  if (existingUser) {
    next(new AppError("Email already in use.", 400));
  }

  try {
    const newUser = await userServices.createUserByEmailAndPassword(req.body);
    createAndSendToken(newUser, 201, res);
  } catch (error) {
    return next(new AppError(error, 400));
  }
});

exports.login = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // 1) check if email and password exists
    if (!email || !password) {
      next(new AppError("Please provide name and password", 400));
    }

    const existingUser = await userServices.findUserByEmail(email);
    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      return next(new AppError("Incorrect name or password", 401));
    }

    // 3) if everything ok , send token to client
    createAndSendToken(existingUser, 200, res);
  } catch (error) {
    return next(new AppError(error, 400));
  }
});

//LOGIC FOR PROTECTED ROUTES

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it exists
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please login to get access", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // 3) Check if user still exists
  const freshUser = await userServices.findUserById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("The token belonging to this user no longer exists", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});
