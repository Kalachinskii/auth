// npm i express
import express from "express";
// npm i cors
import cors from "cors";
// npm i nodemon -D для изменений в реальном времени без перезапуска сервера
// настроить в пакете.джесон - "server": "nodemon server/server.js"
// теперь запуск с npm run server

// иницилизация
const app = express();
// автоматически парсим входящие JSON-запросы
app.use(express.json());
// С какого клиента ловить запросы - origin: "http://localhost:5173"
// cors() - не воспринемай запросы как чужеродные
// credentials: true - достоверный клиент
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cors({ origin: "http://localhost:5173" }));

// каким образом придёт запрос
app.get("/", (request, response) => {
  console.log("успех");

  response.status(200).json({
    id: 1,
    name: "test",
  });
});

// будет работать на порте 3000
app.listen(4000, () => console.log("Сервер запущен"));
//                  запуск
// cd server
// node server.js
