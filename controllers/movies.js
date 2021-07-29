// импортируем модель
const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

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
          throw new BadRequestError('Переданы некорректные данные в методы создания фильма');
        }
        res.send({
          movie: {
            movieId: movie._id,
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
          },
        });
      })
      // если ответ не успешный, отправим на сервер ошибку
      .catch(next);
  },

  removeMovie(req, res, next) {
    // параметром передадим только id
    Movie.findById(req.params.movieId)
      .then((movie) => {
        if (!movie) {
          throw new NotFoundError('Фильм по указанному _id не найден');
        }
        if (String(movie.owner) !== req.user._id) {
          throw new ForbiddenError('Недостаточно прав для удаления фильма');
        }
        Movie.deleteOne({ _id: movie._id })
          .then(() => {
            res.send({ movie });
          })
          .catch(next);
      })

      .catch(next);
  },

};
