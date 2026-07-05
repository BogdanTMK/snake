# Snake

Классическая игра "Змейка" в браузере с сохранением результатов. После окончания игры можно ввести имя и сохранить счёт в таблицу лидеров.

## Стек

- **Frontend**: HTML5 Canvas, JavaScript, CSS
- **Backend**: Node.js, Fastify
- **Database**: PostgreSQL

## Как запустить локально

```bash
# 1. Установить зависимости
npm install

# 2. Создать базу данных PostgreSQL
psql -U postgres -c "CREATE DATABASE snake_db;"

# 3. Указать строку подключения к БД
#    В server.js: connectionString: 'postgres://postgres:ПАРОЛЬ@localhost:5432/snake_db'

# 4. Запустить сервер в режиме разработки
npm run dev
```
Сервер запустится на `http://localhost:3000`.

## Деплой

[https://snakeproject-qe8g.onrender.com/](https://snakeproject-qe8g.onrender.com/)

## CodeClimate

[![Maintainability](https://qlty.sh/gh/BogdanTMK/projects/snake/maintainability.svg)](https://qlty.sh/gh/BogdanTMK/projects/snake)
