import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const jwt_secret = process.env.JWT_SECRET;
const jwt_refresh_secret = process.env.JWT_REFRESH_SECRET;

const tokens_expiration_time = {
  jwt_access_token_format: "1h",
  jwt_refresh_token_format: "7d",
  date_access_token_format: 60 * 60 * 1000,
  date_refresh_token_format: 7 * 24 * 60 * 60 * 1000,
};

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

const generateTokens = (id, email) => {
  const accessToken = jwt.sign({ id, email }, jwt_secret, {
    expiresIn: tokens_expiration_time.jwt_access_token_format,
  });
  const refreshToken = jwt.sign({ id, email }, jwt_refresh_secret, {
    expiresIn: tokens_expiration_time.jwt_refresh_token_format,
  });

  return { token: accessToken, refreshToken };
};

app.post("/api/signin", async (req, resp) => {
  const result = SigninFormSchema.safeParse(req.body);

  if (!result.success) {
    return resp.status(400).json({ error: result.error.flatten().fieldErrors });
  }

  const { email, password } = result.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return resp.status(401).json({ error: "Email is not correct" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return resp.status(401).json({ error: "Password is not correct" });
    }

    const { token, refreshToken } = generateTokens(user.id, user.email);

    // при авторизации +новый токен
    // await prisma.refreshToken.create({
    //   data: {
    //     userId: user.id,
    //     refreshToken: refreshToken,
    //     expiresAt: new Date(
    //       Date.now() + tokens_expiration_time.date_refresh_token_format
    //     ),
    //   },
    // });
    await prisma.refreshToken.upsert({
      where: {
        userId: user.id, // Ищем запись по userId
      },
      update: {
        // Если нашли - обновляем
        refreshToken: refreshToken,
        expiresAt: new Date(
          Date.now() + tokens_expiration_time.date_refresh_token_format
        ),
      },
      create: {
        // Если не нашли - создаем
        userId: user.id,
        refreshToken: refreshToken,
        expiresAt: new Date(
          Date.now() + tokens_expiration_time.date_refresh_token_format
        ),
      },
    });

    return resp
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: tokens_expiration_time.date_access_token_format,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: tokens_expiration_time.date_refresh_token_format,
      })
      .status(200)
      .json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    return resp.status(500).json({ error: "Server error" });
  }
});

app.post("/api/signup", async (req, resp) => {
  const result = SignupFormSchema.safeParse(req.body);

  if (!result.success) {
    return resp.status(400).json({ error: result.error.flatten().fieldErrors });
  }

  const { email, password } = result.data;

  try {
    const isUserExists = await prisma.user.findUnique({ where: { email } });

    if (isUserExists) {
      return resp.status(400).json({ error: "Email is already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    if (newUser) {
      const { token, refreshToken } = generateTokens(newUser.id, newUser.email);

      await prisma.refreshToken.upsert({
        where: {
          userId: newUser.id,
        },
        update: {
          refreshToken: refreshToken,
          expiresAt: new Date(
            Date.now() + tokens_expiration_time.date_refresh_token_format
          ),
        },
        create: {
          userId: newUser.id,
          refreshToken: refreshToken,
          expiresAt: new Date(
            Date.now() + tokens_expiration_time.date_refresh_token_format
          ),
        },
      });

      return resp
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: tokens_expiration_time.date_access_token_format,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: tokens_expiration_time.date_refresh_token_format,
        })
        .status(201)
        .json({ user: { id: newUser.id, email: newUser.email } });
    } else {
      throw new Error();
    }
  } catch (err) {
    console.error("Signup error:", err); // Добавьте логирование для отладки
    return resp.status(500).json({ error: "Server error" });
  }
});

app.get("/api/signout", async (req, resp) => {
  const token = req.cookies.token;
  if (token) {
    return resp
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({ message: "Signout success" });
  } else {
    return resp.status(401).json({ error: "Token is not found" });
  }
});

const checkAuth = (req, resp, next) => {
  const messages = {
    notFoundToken: "Token is not found",
    invalidToken: "Invalid token",
  };

  try {
    const token = req.cookies.token;

    if (!token) {
      throw new Error(messages.notFoundToken);
    }

    jwt.verify(token, jwt_secret, (err, user) => {
      if (err) {
        return resp.status(401).json({ error: messages.invalidToken });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return resp.status(401).json({ error: error.message });
  }
};

app.get("/api/protected", checkAuth, async (req, resp) => {
  return resp
    .status(200)
    .json({ user: { id: req.user.id, email: req.user.email } });
});

app.get("/api/refresh-token", async (req, resp) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return resp.status(401).json({ error: "refresh token is not found" });
  }

  jwt.verify(refreshToken, jwt_refresh_secret, async (err, user) => {
    if (err) {
      return resp.status(401).json({ error: "Нет токена" });
    }

    try {
      // ищем по refreshToken а не по id user
      const dbRefreshToken = await prisma.refreshToken.findUnique({
        where: { refreshToken },
      });

      if (
        // !dbRefreshToken ||
        !dbRefreshToken?.refreshToken ||
        dbRefreshToken.refreshToken !== refreshToken
      ) {
        return resp.status(401).json({ error: "Invalid refresh token" });
      }

      const { token, newRefreshToken } = generateTokens(user.id, user.email);

      await prisma.refreshToken.update({
        where: { id: dbRefreshToken.id },
        data: {
          // token: newRefreshToken,
          refreshToken: newRefreshToken,
          expiresAt: new Date(
            Date.now() + tokens_expiration_time.date_refresh_token_format
          ),
        },
      });

      return resp
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: true,
          maxAge: tokens_expiration_time.date_access_token_format,
        })
        .cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: true,
          maxAge: tokens_expiration_time.date_refresh_token_format,
        })
        .status(201)
        .json({ user: { id: user.id, email: user.email } });
    } catch (error) {
      return resp.status(401).json({ error: error.message });
    }
  });
});

app.listen(4000, () => console.log("Server started"));
