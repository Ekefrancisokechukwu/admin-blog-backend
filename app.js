require("dotenv").config();
require("express-async-errors");

// express
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");

// rest of the package
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with  credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// database
const connectDB = require("./db/connect");

//  routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comment", commentRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || "5000";

async function start() {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`App running on port:${port}`));
  } catch (error) {
    console.log(error);
  }
}

start();
