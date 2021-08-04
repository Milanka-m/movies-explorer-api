const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized-err');
const { AUTH_BAD_EMAIL, AUTH_BAD_PASS } = require('../utils/messageConstant');

const { JWT_KEY } = require('../utils/config');
// функция, которая генерирует токен, принимает id пользователя
const generateAccessToken = (_id) => {
  const payload = { _id };
  return jwt.sign(payload, JWT_KEY, {
    expiresIn: '7d',
  });
};

module.exports.login = (req, res, next) => {
  // получаем поля логин и пароль из тела запроса
  const { email, password } = req.body;

  // ищем пользователя по email
  User.findOne({ email }).select('+password')
    .then((user) => {
      // если не найден такой пользователь надо вернуть ошибку
      if (!user) {
        throw new UnauthorizedError(AUTH_BAD_EMAIL);
      }
      // проверяем пароль на корректность, передаем параметры (пароль и захешированный пароль)
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      // если пароль некорректен вернем ошибку
      if (!isPasswordCorrect) {
        throw new UnauthorizedError(AUTH_BAD_PASS);
      }

      // возвращаем jwt
      return res.send({
        token: generateAccessToken(user._id),
      });
    })
    .catch(next);
};
