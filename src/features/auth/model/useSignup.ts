import { authApi } from "@/entities/user/api/auth";
import type { AxiosError } from "axios";

export const useSignup = () => {
  authApi
    .signup({ email: "user@mail.ru", password: "1234" })
    .then((resp) => console.log(resp.data.message))
    .catch((error: AxiosError<{ error: string }>) => {
      console.log(error.response?.data.error);
    });
  // return {};
};
