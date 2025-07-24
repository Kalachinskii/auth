import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
// создаьть экземпляр класса
const prisma = new PrismaClient();
const jwt_secret = process.env.JWT_SECRET;

//_________________________________________________
// проверка формы сервера
import { z } from "zod";
import { useState } from "react";
import { error } from "console";

const formSchemaConst = {
  emailMin: 6,
  passwordMin: 4,
  passwordMax: 20,
};

const passwordSchema = z
  .string()
  .min(
    formSchemaConst.passwordMin,
    `Password must not be less than ${formSchemaConst.passwordMin} characters.`
  )
  .max(
    formSchemaConst.passwordMax,
    `Password must not be more than ${formSchemaConst.passwordMax} characters.`
  )
  .regex(/[A-Z]/, "Password must contain capital characters.")
  .regex(/[a-z]/, "Password must contain small characters.")
  .regex(/[0-9]/, "Password must contain numeric characters.");

const BaseFormSchema = z.object({
  email: z
    .string()
    .email()
    .min(
      formSchemaConst.emailMin,
      `Email must be at least ${formSchemaConst.emailMin} characters.`
    ),
  password: passwordSchema,
});

export const SigninFormSchema = BaseFormSchema;

export const SignupFormSchema = BaseFormSchema.extend({
  confirmPassword: passwordSchema.optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
//_________________________________________________

// каким образом придёт запрос
app.get("/", (request, response) => {
  console.log("успех");

  response.status(200).json({
    id: 1,
    name: "test",
  });
});

app.post("/signin", async (request, response) => {
  const result = SigninFormSchema.safeParse(request.body);
  if (!result.success) {
    return response
      .status(400)
      .json({ error: result.error.flatten().fieldErrors });
  }
  const { email, password } = result.data;

  // запрос
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return response.status(401).json({ error: "Некоректный логин" });
    }
    // сравнить захешированные пароли
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return response.status(401).json({ error: "Неправельный пароль" });
    }
    const token = jwt.sign({ id: user.id }, jwt_secret, {
      expiresIn: "1h",
    });
    return response
      .status(200)
      .json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    return response.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/signup", async (request, response) => {
  // проверили что все правельное пришло из формы
  const result = SignupFormSchema.safeParse(request.body);
  // если вернулись ошибки - выдаём ошибку
  if (!result.success) {
    return response
      .status(400)
      .json({ error: result.error.flatten().fieldErrors });
  }
  // вытянули почту и пароль
  const { email, password } = result.data;
  // проверка на существующего пользовотеля (почта)
  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    // если есть такая почта
    if (isUserExist) {
      return response.status(400).json({ error: "Логин уже существует" });
    }
    // шифруем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    // отправляем в БД (призма)
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    // Позитивчик - для нового пользовотеля деаем токен
    if (newUser) {
      // подпись - установить сессию - user | подпись | время сессии
      const token = jwt.sign({ id: newUser.id }, jwt_secret, {
        expiresIn: "1h",
      });

      return response
        .status(201)
        .json({ token, user: { id: newUser.id, email: newUser.email } });
      // негативчик - выдаём ошибку сервера
    } else {
      // иная ошибка - не 500 посмотреть
      return response.status(500).json({ error: "Ошибка сервера" });
    }
  } catch (error) {
    return response.status(500).json({ error: "Ошибка сервера" });
  }
});

const checkAuth = (req, resp, next) => {
  if (!req.headers.authorization) {
    return resp.status(401).json({ error: "Токен не существует" });
  }

  const token = req.headers.authorization.split(" ")[1];

  if (token === "undefined") {
    console.log(1);
    return resp.status(401).json({ error: "Токен не существует" });
  }
  console.log(123);
  jwt.verify(token, jwt_secret, (err, user) => {
    if (err) {
      return resp.status(401).json({ error: "Некоректный токен" });
    }
    next();
  });
};

// get(url, midlware, func)
app.get("/protected", checkAuth, async (req, resp) => {
  return resp.status(200).json({ mes: "Oks" });
});

app.listen(4000, () => console.log("Сервер запущен"));
