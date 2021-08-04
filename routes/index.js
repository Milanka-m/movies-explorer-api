const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const authMiddlevare = require('../middlewares/auth');

// импортируем роутер users
const userRoutes = require('./users');
// импортируем роутер cards
const movieRoutes = require('./movies');

const { createUser } = require('../controllers/users');
const { login } = require('../controllers/login');

// роутер регистрации
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

// роутер авторизации
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use('/users', authMiddlevare, userRoutes);
router.use('/movies', authMiddlevare, movieRoutes);

module.exports = router;
