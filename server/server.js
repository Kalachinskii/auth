// npm i express
import express from "express";
// npm i cors
import cors from "cors";
// import { error } from "console";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// иницилизация
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
// создаьть экземпляр класса
const prisma = new PrismaClient();
const jwt_secret = process.env.JWT_SECRET;

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
    console.log(jwt_secret);
    request.body = {
        email: "asd@mail.ru",
        password: "123",
        confirmPassword: "123",
    };

    const result = SignupFormSchema.safeParse(request.body);

    if (!result.success) {
        return response
            .status(400)
            .json({ error: result.error.flatten().fieldErrors });
    }

    const { email, password } = request.body;

    const isUserExist = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (isUserExist) {
        return response.status(400).json({ error: "Login is already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    if (newUser) {
        // подпись - установить сессию
        // 1 - user | 2 - подпись | 3 - время сессии
        // токен состоит из 3 частей
        const token = jwt.sign({ id: newUser.id }, jwt_secret, {
            expiresIn: "1h",
        });
    }

    return response.status(201).json({ message: "OK" });
});

app.listen(4000, () => console.log("Сервер запущен"));
