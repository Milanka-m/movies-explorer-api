<h1 align="center">
    📰 API MoviesExplorer
</h1>

***
## Бэкенд для сервиса Movies Explorer - дипломного проекта по профессии веб-разработчик курса [Яндекс Практикум](https://praktikum.yandex.ru 'Яндекс Практикум').

Сервер доступен по адресу - http://api.movies-explorer-22.nomoredomains.club

## 📖 Документация к API

#### `POST /signup`
создаёт пользователя с переданными в теле `email, password и name`

#### `POST /signin` 
проверяет переданные в теле `email и password` и возвращает `JWT`

#### `GET /users/me`
возвращает информацию о пользователе, его `email и name` - **роут защищен авторизацией**

#### `GET /movies`
возвращает все сохранённые пользователем фильмы - **роут защищен авторизацией**

#### `POST /movies`
создаёт фильм с переданными в теле `movieId, country, director, duration, year, description, image, trailer, thumbnail, nameRU, nameEN,` - **роут защищен авторизацией**

#### `DELETE /movies/id`
удаляет сохранённый фильм по `id` - **роут защищен авторизацией**

## 👨🏻‍💻 JavaScript, 🚂 Express

В проекте задействованы две сущности: пользователи и фильмы. Схемы и модели созданы через `Mongoose` с валидируемыми полями. Все роуты, кроме логина и регистрации, защищены мидлвэрей `auth`, которая проверяет Authorization и наличие в нем токена в приходящих запросах. Обращение к API происходит через роуты с валидацией запросов через `Joi` и `celebrate`. В контроллерах описана логика обработки запросов. Контроллер логина создает `JWT токен` сроком на неделю. В контроллере регистрации пользователя пароль хешеруется модулем `bcryptjs`. В проекте реализована централизованная обработка ошибок через конструкторы ошибок - конструкторы передаются в блоках catch через функцию next и далее в мидлвэр обработки ошибок `errorsHandler` в app.js. Для логгирования запросов и ошибок используется библиотека `Winston`.
Для разворачивания сервера используется облачный сервис [Яндекс.Облако](https://cloud.yandex.ru/).

## 📃 Стек

- Java Script
- Node.js
- Express.js
- MongoDB


## 💻 Установка зависимостей

##### `npm install` – установить зависимости проекта

##### `npm run start` – запуск сервера на http://localhost:3000/

##### `npm run dev` – запуск сервера с hot reload на http://localhost:3000/
