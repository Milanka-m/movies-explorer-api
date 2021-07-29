const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// импортируем методы контроллера cards
const {
  findMovies,
  createMovie,
  removeMovie,
} = require('../controllers/movies');

// роутер чтения (получения информации) о всех фильмах сохраненных пользователем
router.get('/', findMovies);

// роутер записи (создания объекта) фильма
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required().min(2),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required().min(2).max(200),
    image:
    Joi.string()
      .required()
      .pattern(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
    trailer:
    Joi.string()
      .required()
      .pattern(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
    thumbnail:
    Joi.string()
      .required()
      .pattern(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
    nameRU: Joi.string().required().min(2).max(50),
    nameEN: Joi.string().required().min(2).max(50),
  }),
}), createMovie);

// роутер удаления фильма, сохраненного пользователем
router.delete('/:movieId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), removeMovie);

module.exports = router;
