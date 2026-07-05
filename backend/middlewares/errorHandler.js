// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || err.statusCode || res.statusCode;

  if (statusCode === 200) {
    statusCode = 500;
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    statusCode = 400;
  }

  res.status(statusCode);
  res.json({
    message: statusCode === 500 ? 'Internal server error' : err.message,
  });
};

module.exports = errorHandler;
