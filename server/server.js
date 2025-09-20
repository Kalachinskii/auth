import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const prisma = new PrismaClient();

import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import nodemailer from "nodemailer";
import { error } from "console";

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
// запускаем
app.use(passport.initialize());

const jwt_secret = process.env.JWT_SECRET;
const jwt_refresh_secret = process.env.JWT_REFRESH_SECRET;

const tokens_expiration_time = {
  jwt_access_token_format: "1h",
  jwt_refresh_token_format: "7d",
  jwt_refresh_reset_token_format: "10m",
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

const emailSchema = z
  .string()
  .email()
  .min(
    formSchemaConst.emailMin,
    `Email must be at least ${formSchemaConst.emailMin} characters.`
  );

const PasswordFormSchema = z.object({ passport: passwordSchema });

const EmailFormSchema = z.object({ email: emailSchema });

const BaseFormSchema = z.object({
  email: emailSchema,
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

    // при новом входе в систему очищать старые куки
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

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
        .status(201)
        .json({ user: { id: newUser.id, email: newUser.email } });
    } else {
      throw new Error();
    }
  } catch (err) {
    console.error("Signup error:", err);
    return resp.status(500).json({ error: "Server error" });
  }
});

app.post("/api/signout", async (req, resp) => {
  try {
    const userId = req.body.id;

    // удаляем куку токена в БД
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    // удаляем в куке при успехе в БД
    return resp
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({ message: "Signout success" });
  } catch (error) {
    return resp.status(500).json({ error: "Ошибка сервера" });
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

// асинхронный запрос через функцию checkAuth
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
        !dbRefreshToken?.refreshToken ||
        dbRefreshToken.refreshToken !== refreshToken
      ) {
        return resp.status(401).json({ error: "Invalid refresh token" });
      }

      const { token, refreshToken: newRefreshToken } = generateTokens(
        user.id,
        user.email
      );

      await prisma.refreshToken.create({
        where: { id: dbRefreshToken.id },
        data: {
          refreshToken: newRefreshToken,
          expiresAt: new Date(
            Date.now() + tokens_expiration_time.date_refresh_token_format
          ),
        },
      });

      console.log(newRefreshToken);

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
      return resp.status(500).json({ error: "Internal server error" });
    }
  });
});

passport.serializeUser((user, done) => {
  // автоматически сработает при отправке / получение от гугла информации
  done(null, user.id);
});

// развернуть пришедшие данные в объет
passport.deserializeUser(async (id, done) => {
  try {
    done(null, id);
  } catch (error) {
    done(error, null);
  }
});

// стратегия
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // куда перенаправить после аунтификации
      callbackURL: "http://localhost:4000/api/auth-google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // логика после входа
        if (!profile.id || !profile.emails[0].value)
          throw new Error("fail Google auth");
        // console.log(profile.emails[0].value);

        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails[0].value,
            },
          });
        }

        const tokens = generateTokens(user.id, user.email);

        return done(null, { user, tokens });
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);

app.get(
  "/api/auth-google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
      if (err) {
        console.log("Authentication error:", err);
        return res.redirect(
          `${process.env.FRONTEND_URL}/signin?google_auth_error=true`
        );
      }
      if (!user) {
        console.log("Authentication failed:", info);
        return res.redirect(
          `${process.env.FRONTEND_URL}/signin?google_auth_error=true`
        );
      }

      // если с юзером всё ок отправляем данные дальше
      req.user = user;
      next();
    })(req, res, next);
  },

  // успех
  async (req, resp) => {
    try {
      // console.log(req.user, req.tokens);
      const { user, tokens } = req.user;

      await prisma.refreshToken.deleteMany({
        where: {
          userId: user.id,
        },
      });

      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(
            Date.now() + tokens_expiration_time.date_refresh_token_format
          ),
        },
      });

      return resp
        .cookie("token", tokens.token, {
          httpOnly: true,
          secure: true,
          sameSite: true,
          maxAge: tokens_expiration_time.date_access_token_format,
        })
        .cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: true,
          maxAge: tokens_expiration_time.date_refresh_token_format,
        })
        .status(201)
        .redirect(process.env.FRONTEND_URL);
    } catch (error) {
      console.log("Callvack processing error:", error);
      return resp.redirect(
        `${process.env.FRONTEND_URL}/signin?google_auth_error=true`
      );
    }
  }
);

app.get(
  "/api/auth-google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    // имя сервера
    host: process.env.SMTP_HOST,
    // порт
    port: process.env.SMTP_PORT,
    // защишенное соеденение
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    // отключить проверка CLS сертификата
    tls: {
      rejectUnauthorized: false,
    },
  });

  // отправка
  transporter.sendMail({
    // от кого
    from: `Support <${process.env.SMTP_USER}>`,
    // кому
    to,
    // тема письма
    subject,
    // содержимое
    html,
  });
};

app.post("/api/forgot-password", async (req, resp) => {
  // console.log("forgot-password: ", req.body);

  // проверка пришедшой почты через zod
  const res = EmailFormSchema.safeParse(req.body);

  if (!res.success) {
    return resp.status(400).json({ error: resp.error.flatten().fieldErrors });
  }

  // вытаскиваем почту
  const { email } = res.data;

  try {
    // ищем уникального польльзователя по email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.googleId) {
      return resp.status(404).json({ error: "Пользователь не найден" });
    }

    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      jwt_secret,
      {
        expiresIn: tokens_expiration_time.jwt_refresh_reset_token_format,
      }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // функция отправки писем
    await sendEmail(
      email,
      "Восстановление пароля",
      `<p>Перейдите по ссылке, что бы збросить пароль: <a href="${resetLink}">Сбросить пароль</a></p>`
    );

    return resp
      .status(200)
      .json({ message: "Отправлена ссылка на востановление пароля" });
  } catch (error) {
    return resp.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/reset-password", async (req, resp) => {
  const res = PasswordFormSchema.safeParse(req.body);

  if (!res.success) {
    return resp.status(400).json({ error: res.error.flatten().fieldErrors });
  }

  const { newPassword, token } = req.body;

  if (!token) {
    return resp.status(401).json({ error: "Токен не найден" });
  }

  jwt.verify(token, jwt_secret, async (err, parsed_user) => {
    if (err) {
      return resp.status(401).json({ error: "Неверный токен" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: parsed_user.id,
          email: parsed_user.email,
        },
      });

      if (!user) {
        return resp.status(404).json({ error: "Не найден пользователь" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: {
          id: user.id,
          email: user.email,
        },
        data: { password: hashedPassword },
      });

      return resp.status(201).json({ message: "Пароль успешно обнавлён" });
    } catch (error) {
      return resp.status(500).json({ error: "Ошибка сервера" });
    }
  });
});

app.listen(4000, () => console.log("Server started"));
