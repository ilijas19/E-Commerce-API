const Review = require("../models/Review");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isProductValid = await Product.findOne({ _id: productId });
  if (!isProductValid) {
    throw new CustomError.NotFoundError(`No product with id:${productId}`);
  }
  const existingReview = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (existingReview) {
    throw new CustomError.BadRequestError(
      `Alredy subbmited review for this product`
    );
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "success", review });
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({
      path: "user",
      select: "name",
    });

  res.status(StatusCodes.OK).json({ reviews });
};
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId })
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({
      path: "user",
      select: "name",
    });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { comment, title, rating } = req.body;
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id:${reviewId}`);
  }
  review.comment = comment || review.comment;
  review.title = title || review.title;
  review.rating = rating || review.rating;

  await review.save();
  res.status(StatusCodes.OK).json({ msg: "Success", review });
};
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOneAndDelete({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`no review with id: ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "Review Deleted" });
};

//Query Virtuals
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError.NotFoundError(`no product with id: ${productId}`);
  }
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
