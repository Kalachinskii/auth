import type { AxiosError } from "axios";
import type { SignupFormSchema } from "./formSchema";
import type { z } from "zod";
import { authApi } from "@/entities/user";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/router/constants";
import { toast } from "sonner";

export const useSignup = () => {
    const navigate = useNavigate();

    const signupHandler = async (data: z.infer<typeof SignupFormSchema>) => {
        try {
            throw new Error();
            await authApi.signup(data);
            navigate(ROUTES.HOME);
        } catch (error) {
            toast.error("Signup fail");
        }
    };

    return { signupHandler };
};
