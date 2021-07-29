const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// импортируем методы контроллера users
const {
  findUser,
  updateUserProfile,
} = require('../controllers/users');

// роутер возвращает профильные данные
router.get('/me', findUser);

// роутер обновления данных профиля
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);

module.exports = router;
