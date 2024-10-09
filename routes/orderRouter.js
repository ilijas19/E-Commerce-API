const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/auth");

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder,
  cancelOrder,
} = require("../controllers/orderController");

router
  .route("/")
  .get(authenticateUser, authorizePermission("admin"), getAllOrders)
  .post(authenticateUser, createOrder);

router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrder);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, authorizePermission("admin"), updateOrder)
  .delete(authenticateUser, cancelOrder);

module.exports = router;
