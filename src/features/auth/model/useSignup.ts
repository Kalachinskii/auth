import { AxiosError } from "axios";
import type { SignupFormSchema } from "./formSchema";
import type { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/router/constants";
import { toast } from "sonner";
import { authApi } from "@/entities/user/api/auth";

export const useSignup = () => {
    const navigate = useNavigate();

    const signupHandler = async (data: z.infer<typeof SignupFormSchema>) => {
        try {
            // throw new Error();
            await authApi.signup(data);
            navigate(ROUTES.HOME);
        } catch (error) {
            if (error instanceof AxiosError) {
                // преобразовать в массив ошибок
                // const res = Object.entries(error);
                //
                // массив ошибок по нашим полям
                const errorsArray = Object.entries(error.response?.data.error);
                // const errorMes = errorsArray.map(
                //     (err) =>
                //         `<b>${err[0]}: </b> ${err[1].map(
                //             (innerErr) => `<span>${innerErr}</span><br>`
                //         )} <br>`
                // );

                toast.error("Signup fail");
            }
        }
    };

    return { signupHandler };
};
