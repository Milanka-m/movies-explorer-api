const NotFoundError = require('../errors/not-found-err');
const { NOT_FOUND } = require('../utils/messageConstant');

module.exports = (req, res, next) => {
  next(new NotFoundError(NOT_FOUND));
};
