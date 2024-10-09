const Order = require("../models/Order");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems) {
    throw new CustomError.BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Both tax and shipping fee must be provided"
    );
  }
  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findById(item.product);
    if (!dbProduct) {
      throw new CustomError.NotFoundError(`No product with id:${item.product}`);
    }

    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      name,
      price,
      image,
      amount: item.amount,
      product: _id,
    };
    orderItems = [...orderItems, singleOrderItem];
    subtotal += price * item.amount;
  }
  const total = subtotal + tax + shippingFee;
  const order = await Order.create({
    tax,
    shippingFee,
    subtotal,
    total,
    orderItems,
    user: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json(order);
};
const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId, user: req.user.userId });
  if (!order) {
    throw new CustomError.NotFoundError(
      `No order with id:${orderId} in YOUR orders`
    );
  }
  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrder = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  if (orders.length < 1) {
    throw new CustomError.NotFoundError("No current orders");
  }
  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};
const updateOrder = async (req, res) => {
  const { status, id: orderId } = req.body;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id:${orderId}`);
  }
  order.status = status;
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};
const cancelOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOneAndDelete({
    _id: orderId,
    user: req.user.userId,
  });
  if (!order) {
    throw new CustomError.NotFoundError(
      `No order with id:${orderId} in YOUR orders`
    );
  }
  res.status(StatusCodes.OK).json({ msg: "Order Deleted" });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder,
  cancelOrder,
};
