const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/auth");

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");

const { getSingleProductReviews } = require("../controllers/reviewController");

router
  .route("/")
  .get(getAllProducts)
  .post(authenticateUser, authorizePermission("admin"), createProduct);

router
  .route("/uploadImage")
  .post(authenticateUser, authorizePermission("admin"), uploadImage);

router
  .route("/:id")
  .get(authenticateUser, authorizePermission("admin"), getSingleProduct)
  .patch(authenticateUser, authorizePermission("admin"), updateProduct)
  .delete(authenticateUser, authorizePermission("admin"), deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
