const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select({ password: 0 });
  res.status(StatusCodes.OK).json({ users });
};
const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findById(userId).select({ password: 0 });
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  if (!currentUser) return;
  res.status(StatusCodes.OK).json({ currentUser });
};
const updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new CustomError.BadRequestError("All credientials must be provided");
  }
  const user = await User.findById(req.user.userId);
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Wrong password");
  }
  user.name = name;
  user.email = email;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: user });
};
const updateUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new CustomError.BadRequestError("Both passwords are required");
  }
  const user = await User.findById(req.user.userId);
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Wrong password");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password Updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
