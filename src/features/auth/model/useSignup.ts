import { AxiosError } from "axios";
import type { SignupFormSchema } from "./formSchema";
import type { z } from "zod";
import { useNavigate } from "react-router-dom";
// import { ROUTES } from "@/shared/router/constants";
import { toast } from "sonner";
import { authApi } from "@/entities/user/api/auth";
import * as Cookies from "js-cookie";

export const useSignup = () => {
    const navigate = useNavigate();

    const signupHandler = async (
        data: z.infer<typeof SignupFormSchema>,
        setError: (field: string, message: string) => void
    ) => {
        try {
            // throw new Error();
            const resp = await authApi.signup(data);
            // сохраняем в куки
            // npm i js-cookie - куки
            // npm i -D @types/js-cookie - типы для куки
            if (!resp.data.token) throw new Error("Нет токена");
            // 1 - день / 24 часа т.к. задавали время 1 час
            Cookies.default.set("token", resp.data.token, { expires: 1 / 24 });

            // navigate(ROUTES.HOME);
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.error) {
                setError("email", error.response.data.error);
            } else {
                setError("root", "Произошла ошибка");
            }
            throw error; // Пробрасываем ошибку дальше
        }
    };

    return { signupHandler };
};
