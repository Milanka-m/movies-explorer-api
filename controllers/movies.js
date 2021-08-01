// импортируем модель
const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  NOT_FOUND_MOVIE, BAD_REQUESTS_MOVIE, FORBIDDEN_DELETE_MOVIE, DELETE_MOVIE,
} = require('../utils/messageConstant');

module.exports = {

  // контроллер для получения сохранённыx пользователем фильмов
  findMovies(req, res) {
    // ищем все фильмы
    Movie.find({})
      .then((movies) => res.send(movies))
      .catch((err) => res.send({ err }));
  },

  createMovie(req, res, next) {
    const owner = req.user._id;
    const {
      movieId,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      nameRU,
      nameEN,
    } = req.body;
    // создаем фильм
    Movie.create({
      movieId,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      nameRU,
      nameEN,
      owner,
    })
      // если ответ успешный, на сервер отправиться объект movie
      .then((movie) => {
        if (!movie) {
          throw new BadRequestError(BAD_REQUESTS_MOVIE);
        }
        res.send({ movie });
      })
      // если ответ не успешный, отправим на сервер ошибку
      .catch(next);
  },

  removeMovie(req, res, next) {
    // параметром передадим только id
    Movie.findById(req.params.id)
      .then((movie) => {
        if (!movie) {
          throw new NotFoundError(NOT_FOUND_MOVIE);
        }
        if (String(movie.owner) !== req.user._id) {
          throw new ForbiddenError(FORBIDDEN_DELETE_MOVIE);
        }
        Movie.deleteOne({ _id: movie._id })
          .then(() => {
            res.send({
              message: DELETE_MOVIE,
              movie,
            });
          })
          .catch(next);
      })

      .catch(next);
  },

};
