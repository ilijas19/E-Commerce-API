const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { attachCookiesToResponse, createUserPayload } = require("../utils");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const existingEmail = await User.findOne({ email: email });
  if (existingEmail) {
    throw new CustomError.BadRequestError("Email is already in use");
  }
  const user = await User.create({ name, email, password });
  const userPayload = createUserPayload(user);

  attachCookiesToResponse(res, userPayload);
  res.status(StatusCodes.CREATED).json({ user: userPayload });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError(
      "Email and Password must be provided"
    );
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomError.NotFoundError("No user found with specified email");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Wrong Password");
  }
  const userPayload = createUserPayload(user);

  attachCookiesToResponse(res, userPayload);

  res.status(StatusCodes.OK).json({ msg: "Login Success", user: userPayload });
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = { login, register, logout };
