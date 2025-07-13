import { SigninFormSchema } from "./formSchema";
// import type { AxiosError } from "axios";
import type { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/router/constants";
import { toast } from "sonner";
import { authApi } from "@/entities/user/api/auth";
import * as Cookies from "js-cookie";
import type { ValidationFormFieldTypes } from "../types";
import { useState } from "react";
import type { AxiosError } from "axios";

export const useSignin = () => {
    const navigate = useNavigate();
    const [sererValidationErrors, setSererValidationErrors] =
        useState<ValidationFormFieldTypes | null>(null);
    const signinHandler = async (data: z.infer<typeof SigninFormSchema>) => {
        try {
            // throw new Error();
            const resp = await authApi.signin(data);
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

    return { signinHandler };
};
