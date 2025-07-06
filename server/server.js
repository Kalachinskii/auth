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
    const [sererValidationErrors, setSererValidationErrors] =
        useState < ValidationFormFieldTypes > null;

    // проверили что все правельное пришло из формы
    const result = SignupFormSchema.safeParse(request.body);
    // если вернулись ошибки - выдаём ошибку
    if (!result.success) {
        return response
            .status(400)
            .json({ error: result.error.flatten().fieldErrors });
    }
    // вытянули почту и пароль
    const { email, password } = request.body;
    // проверка на существующего пользовотеля (почта)
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
        return response.status(500).json({ error: "Ошибка сервера" });
    }
});

app.listen(4000, () => console.log("Сервер запущен"));
