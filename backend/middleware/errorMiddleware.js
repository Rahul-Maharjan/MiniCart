const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({ message: "Not Found" });
};

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
};

module.exports = { notFoundMiddleware, errorHandlerMiddleware };
