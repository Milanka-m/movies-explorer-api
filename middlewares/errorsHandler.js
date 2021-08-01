const { SERVER_ERROR } = require('../utils/messageConstant');

module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const { message } = err;
  res.status(status).json({ message: message || SERVER_ERROR });
  return next();
};
