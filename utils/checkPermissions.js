const CustomError = require("../errors");

const checkPermissions = (reqUser, foundUserId) => {
  if (reqUser.role === "admin") return;
  if (reqUser.userId === foundUserId.toString()) return;
  throw new CustomError.UnauthorizedError("Not Authorized");
};
module.exports = checkPermissions;
