const errorHandlerMiddleware = (err, req, res, next) => {
  // console.log(`main Error: ${err.name}`);

  const customError = {
    statusCode: err.statusCode || 500,
    message: err.message || "Something went wrong",
  };

  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
    console.log(err.errors);
  }

  if (err.name === "CastError") {
    customError.message = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }

  res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandlerMiddleware;
