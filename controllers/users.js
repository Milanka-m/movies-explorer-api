const bcrypt = require('bcrypt');
// импортируем модель
const User = require('../models/user');

const opts = { runValidators: true, new: true };
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const {
  NOT_FOUND_USER, USER_NOT_UNIQUE, BAD_REQUESTS_USER, CREATE_USER,
} = require('../utils/messageConstant');

module.exports = {
  // контроллер для получения профильных данных
  findUser(req, res, next) {
    User.findById(req.user._id)
      .then((user) => {
        if (!user) {
          throw new NotFoundError(NOT_FOUND_USER);
        }
        res.send({ user });
      })
      .catch(next);
  },

  // eslint-disable-next-line consistent-return
  async createUser(req, res, next) {
    try {
      const {
        email,
        password,
        name,
      } = req.body;

      // ищем пользователя по email
      const candidate = await User.findOne({ email });
      // если есть такой кандидат надо вернуть ошибку
      if (candidate) {
        throw new ConflictError(USER_NOT_UNIQUE);
      }

      // хешируем пароль
      const hashedPassword = bcrypt.hashSync(password, 9);

      // создадим пользователя с данными полями
      const user = new User({
        email,
        password: hashedPassword,
        name,
      });

      // дождемся пока юзер сохраниться
      await user.save();

      // если ответ успешный, на сервер отправиться объект user
      return res.send({
        message: CREATE_USER,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(BAD_REQUESTS_USER);
      }
      next(err);
    }
  },

  updateUserProfile(req, res, next) {
    const {
      email,
      name,
    } = req.body;
    User.findByIdAndUpdate(req.user._id, {
      email,
      name,
    }, opts)
      .then((user) => {
        res.send({ user });
      })
      // если ответ не успешный, отправим на сервер ошибку
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError(BAD_REQUESTS_USER);
        }
      })
      .catch(next);
  },

};
