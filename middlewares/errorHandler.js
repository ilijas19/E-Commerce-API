const CustomApiError = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomApiError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  if (err.name === "ValidationError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: Object.values(err.errors)
        .map((item) => item.message)
        .join(","),
    });
  }
  if (err.code && err.code === 11000) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: `Duplicate value entered for ${Object.keys(
        err.keyValue
      )} field, please choose another value`,
    });
  }
  if (err.name === "CastError") {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No item Found with id: ${err.value}` });
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: `something went wrong` });
};

module.exports = errorHandler;
