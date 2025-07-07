import { SigninFormSchema } from "./formSchema";
// import type { AxiosError } from "axios";
import type { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/router/constants";
import { toast } from "sonner";
import { authApi } from "@/entities/user/api/auth";
import * as Cookies from "js-cookie";

export const useSignin = () => {
    const navigate = useNavigate();
    const signinHandler = async (data: z.infer<typeof SigninFormSchema>) => {
        console.log("signinHandler");

        try {
            // throw new Error();
            const resp = await authApi.signin(data);
            if (!resp.data.token) throw new Error("Нет токена");
            // 1 - день / 24 часа т.к. задавали время 1 час
            Cookies.default.set("token", resp.data.token, { expires: 1 / 24 });
            navigate(ROUTES.HOME);
        } catch (error) {
            toast.error("Signin fail");
        }

        // authApi
        //   .signin({ email: "admin@mail.ru", password: "1234" })
        //   .then((resp) => console.log(resp.data.message))
        //   .catch((error: AxiosError<{ error: string }>) => {
        //     console.log(error.response?.data.error);
        //   });
    };

    return { signinHandler };
};
