require('dotenv').config();
// подключаем express
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
// подключаем mongoose
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
// импортируем роутер users
const userRoutes = require('./routes/users');
// импортируем роутер cards
const movieRoutes = require('./routes/movies');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/login');
const authMiddlevare = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/Logger');

// создаем приложение методом express
const app = express();
// создаем переменную окружения
const { PORT = 3000 } = process.env;

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function start() {
  await mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
}

app.use(requestLogger); // подключаем логгер запросов

// роуты, не требующие авторизации
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

// мидлвэра, которая по эндопоинту /users будет использовать роутер userRoutes
app.use('/users', authMiddlevare, userRoutes);

// мидлвэра, которая по эндопоинту /movies будет использовать роутер movieRoutes
app.use('/movies', authMiddlevare, movieRoutes);

// мидлвэра, которая отдает 404 ошибку при запросе несуществующего роута
app.use((req, res, next) => {
  next(new NotFoundError('Страница на которую вы попапли, не существует'));
});

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// централизованная обработка ошибок
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const { message } = err;
  res.status(status).json({ message: message || 'Произошла ошибка на сервере' });
  return next();
});

// приложение будет слушаться на 3000 порту
app.listen(PORT);

// при каждом запуске приложения происходит подключение к mongoose
start();
