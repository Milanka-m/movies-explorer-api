const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// импортируем методы контроллера movies
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
    movieId: Joi.number().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
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
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

// роутер удаления фильма, сохраненного пользователем
router.delete('/:id', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), removeMovie);

module.exports = router;
