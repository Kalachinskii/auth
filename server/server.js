import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// npm i cookie-parser
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
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

const generateTockens = (id, email) => {
  const token = jwt.sign({ id, email }, jwt_secret, {
    expiresIn: "1h",
  });

  return { token };
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

// каким образом придёт запрос
app.get("/api/", (request, response) => {
  console.log("успех");

  response.status(200).json({
    id: 1,
    name: "test",
  });
});

app.post("/api/signin", async (request, response) => {
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
    const { token } = generateTockens(user.id, user.email);

    return response
      .cookie("token", token, {
        httpOnly: true,
        // куки не передадуться сюда если нет защищенного соеденения
        secure: true,
        sameSite: true,
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    return response.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/signup", async (request, response) => {
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
      const { token } = generateTockens(newUser.id, newUser.email);

      return response
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: true,
          maxAge: 60 * 60 * 1000,
        })
        .status(201)
        .json({ user: { id: newUser.id, email: newUser.email } });
    } else {
      return response.status(500).json({ error: "Ошибка сервера" });
    }
  } catch (error) {
    return response.status(500).json({ error: "Ошибка сервера" });
  }
});

const checkAuth = (req, resp, next) => {
  const messages = {
    notFoundTocken: "Токен не существует",
    invalideToken: "Некоректный токен",
  };

  try {
    // получить токен со стороны клиента
    const token = req.cookies.token;

    if (!token) {
      throw new Error(messages.notFoundTocken);
    }
    console.log(123);
    jwt.verify(token, jwt_secret, (err, user) => {
      if (err) {
        throw new Error(messages.invalideToken);
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return resp.status(401).json({ error: error.message });
  }
};

// get(url, midlware, func)
app.get("/api/protected", checkAuth, async (req, resp) => {
  return resp
    .status(200)
    .json({ user: { id: req.user.id, email: req.user.email } });
});

app.listen(4000, () => console.log("Сервер запущен"));
