import { AxiosError } from "axios";
import type { SignupFormSchema } from "./formSchema";
import type { z } from "zod";
import { useNavigate } from "react-router-dom";
// import { ROUTES } from "@/shared/router/constants";
import { toast } from "sonner";
import { authApi } from "@/entities/user/api/auth";
import * as Cookies from "js-cookie";
import type { ValidationFormFieldTypes } from "../types";
import { ROUTES } from "@/shared/router/constants";
import { useState } from "react";

export const useSignup = () => {
    const [sererValidationErrors, setSererValidationErrors] =
        useState<ValidationFormFieldTypes | null>(null);
    const navigate = useNavigate();
    const signupHandler = async (data: z.infer<typeof SignupFormSchema>) => {
        try {
            // throw new Error();
            const resp = await authApi.signup(data);
            // сохраняем в куки
            // npm i js-cookie - куки
            // npm i -D @types/js-cookie - типы для куки
            if (!resp.data.token) throw new Error("Нет токена");
            // 1 - день / 24 часа т.к. задавали время 1 час
            Cookies.default.set("token", resp.data.token, { expires: 1 / 24 });
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
            }
        }
    };

    return { signupHandler, sererValidationErrors };
};
