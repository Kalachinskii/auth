// npm i express
import express from "express";
// npm i cors
import cors from "cors";

// иницилизация
const app = express();
// С какого клиента ловить запросы
// cors() - не воспринемай запросы как чужеродные
// credentials: true - удостоверять пользовотеля
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
//                  запуск
// cd server
// node server.js
