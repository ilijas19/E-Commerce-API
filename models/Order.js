const mongoose = require("mongoose");

const singleOrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [singleOrderSchema],
    status: {
      type: String,
      default: "pending",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      required: [true, "specify user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
