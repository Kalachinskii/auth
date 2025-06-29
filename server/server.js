// npm i express
import express from "express";
// npm i cors
import cors from "cors";
import { error } from "console";
import { PrismaClient } from "@prisma/client";
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

//_________________________________________________
// проверка формы сервера
import { z } from "zod";

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

// создаьть экземпляр класса
const prisma = new PrismaClient();

app.post("/signin", (request, response) => {
    if (!request.body.email || !request.body.password) {
        return response
            .status(400)
            .json({ error: "Вы должны передать email и password" });
    }

    const { email, password } = request.body;
    const users = [
        { email: "admin@mail.ru", password: "Qwe123" },
        { email: "user@mail.ru", password: "1234" },
    ];
    const user = users.find(
        (user) => user.email === email && user.password === password
    );
    if (user) {
        // ответ от сервера
        response.status(200).json({ message: "Вы успешно авторизовались" });
    } else {
        response.status(401).json({ error: "Пользователь не найден" });
    }
});

app.post("/signup", async (request, response) => {
    // console.log(request.body);
    /*{
      email: 'asd@gmail.com',
      password: 'Qwe123',
      confirmPassword: 'Qwe123'
    }*/

    // проверить
    const result = SignupFormSchema.safeParse(request.body);
    if (!result.success) {
        return response
            .status(400)
            .json({ error: result.error.flatten().fieldErrors });
    }

    const { email, password } = request.body;
    // await p
    // return;
    // ZOD - заменил валидацию
    // if (!request.body.email || !request.body.password) {
    //   return response
    //     .status(400)
    //     .json({ error: "Вы должны передать email и password" });
    // }
    // const { email, password } = request.body;

    // const email = "sda@mail.ru";
    // const password = "Asdd12323";

    // const users = [
    //   { email: "admin@mail.ru", password: "1234" },
    //   { email: "user@mail.ru", password: "1234" },
    // ];
    // const user = users.some(
    //   (user) => user.email === email && user.password === password
    // );
    // if (user) {
    //   response.status(400).json({ error: "Пользователь существует" });
    // } else {
    //   user.push({ email, password });
    //   response.status(201).json({ message: "Вы успешно зарегистрировались" });
    // }

    // new user s 0
    // существует ли пользователь
    const isUserExist = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (isUserExist) {
        return response.status(400).json({ error: "Login is already exist" });
    }

    const hashedPassword = await bcript.hash(password, 10);

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });
});

// будет работать на порте 3000
app.listen(4000, () => console.log("Сервер запущен"));
//                  запуск
// cd server
// node server.js
