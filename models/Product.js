const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      required: [true, "Please provide name value"],
      type: String,
      trim: true,
      maxLength: [100, "Name can not be more than 100 characters"],
    },
    price: {
      required: [true, "Please provide price value"],
      type: Number,
      min: [1, "Must be positive value"],
    },
    description: {
      required: [true, "Please provide description"],
      type: String,
      maxLength: [1000, "Description can not be more than 1000 characters"],
    },
    image: {
      type: String,
      maxLength: [200, "Img url can not be more than 200 characters"],
      default: "/uploads/example.jpg",
    },
    category: {
      required: [true, "Please provide category"],
      type: String,
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      required: [true, "Please provide company"],
      type: String,
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} IS NOT SUPPORTED",
      },
    },
    colours: {
      type: [String],
      default: ["#222"],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
      min: [1, "Must be positive value"],
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, "Must be positive value"],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Review", //model name
  localField: "_id", //field in this class
  foreignField: "product", //will match this field from review model
  justOne: false,
});

ProductSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.model("Review").deleteMany({ product: this._id });
  }
);

module.exports = mongoose.model("Product", ProductSchema);
