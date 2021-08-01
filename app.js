const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const errorsHandler = require('./middlewares/errorsHandler');
const { ENV_PORT, DB_URL, MONGOOSE_CONFIG } = require('./utils/config');
const limiter = require('./middlewares/rateLimit');

// создаем приложение методом express
const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function start() {
  await mongoose.connect(DB_URL, MONGOOSE_CONFIG);
}

app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);

app.use(router);

// мидлвэра, которая отдает 404 ошибку при запросе несуществующего роута
app.use(notFound);

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// централизованная обработка ошибок
app.use(errorsHandler);

// приложение будет слушаться на 3000 порту
app.listen(ENV_PORT);

// при каждом запуске приложения происходит подключение к mongoose
start();
