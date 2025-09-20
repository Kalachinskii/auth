import type { RouteNames } from "@/shared/types";
import { useEffect, useState } from "react";
import type { ValidationFormFieldTypes } from "../types";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { ROUTES } from "@/shared/router/constants";
import type { SigninFormSchema, SignupFormSchema } from "./formSchema";
import type { z } from "zod";
import { authApi } from "@/entities/user/api/auth";

export const useAuth = (ROUTE_VALUE: `${RouteNames}`) => {
  const [sererValidationErrors, setSererValidationErrors] =
    useState<ValidationFormFieldTypes | null>(null);
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    if (
      location.state?.isPasswordReset &&
      location.state.isPasswordReset === true
    ) {
      toast.success("Пароль успешно изменен. Войдите с новым паролем");
      // обнуляем состояние заданое навигацией для решения F5
      const newState = { ...location.state };
      delete newState.isPasswordReset;
      navigate(location.pathname, {
        replace: true,
        state: Object.keys(newState).length > 0 ? newState : undefined,
      });
    }
  }, []);

  const authHandler = async (
    data: z.infer<typeof SignupFormSchema> | z.infer<typeof SigninFormSchema>
  ) => {
    try {
      await authApi[ROUTE_VALUE](data);

      //   if (!resp.data.token) throw new Error("Нет токена");

      // Cookies.default.set("token", resp.data.token, { expires: 1 / 24 });
      navigate(ROUTES.HOME);
    } catch (err) {
      const error = err as AxiosError<{
        error: string | ValidationFormFieldTypes;
      }>;
      if (error.response?.data.error instanceof Object) {
        setSererValidationErrors(error.response?.data.error);
      } else {
        // модалкой выводим текстовые ошибки
        toast.error(error.response?.data.error);
        // toast.error("Authorization error. Try again");
      }
    }
  };

  return { authHandler, sererValidationErrors };
};
