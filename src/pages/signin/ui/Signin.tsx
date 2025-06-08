import { authApi } from "@/entities/user/api/auth";
import { Button } from "@/shared/ui/button";
import { AxiosError } from "axios";

export function Signin() {
  authApi
    .signin({ email: "user@mail.ru", password: "1234" })
    .then((resp) => console.log(resp.data.message))
    .catch((error: AxiosError<{ error: string }>) => {
      console.log(error.response?.data.error);
    });

  return <h1 className="text-3xl font-bold underline">Signin page</h1>;
}
