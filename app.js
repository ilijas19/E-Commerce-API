require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
//additional packages
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
//swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
//db
const connectDB = require("./db/connectDB");
//middlewares
const notFound = require("./middlewares/not-found");
const errorHandler = require("./middlewares/errorHandler");
//routers
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const reviewRouter = require("./routes/reviewRouter");
const orderRouter = require("./routes/orderRouter");
//app
// extra packagess
app.use(helmet());
app.use(cors());
app.use(xss());
app.get("/", (req, res) => {
  res.send("<h1>E-Commerce API</h1><a href='/api-docs'>Documentation</a>");
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

//
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload({ useTempFiles: true }));

app.get("/api/v1", (req, res) => {
  res.send("<h1>E-COMMERCE-API</h1>");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
