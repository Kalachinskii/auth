import { SigninFormSchema } from "./formSchema";
// import type { AxiosError } from "axios";
import type { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/router/constants";
import { toast } from "sonner";
import { authApi } from "@/entities/user/api/auth";

export const useSignin = () => {
    const navigate = useNavigate();
    const signinHandler = async (data: z.infer<typeof SigninFormSchema>) => {
        console.log("signinHandler");

        try {
            // throw new Error();
            await authApi.signin(data);
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
