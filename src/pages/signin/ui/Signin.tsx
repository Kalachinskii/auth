// import { authApi } from "@/entities/user/api/auth";
import { SigninForm } from "@/features/auth";
import { FormPagesLayoutBox } from "@/shared/ui/layouts/FormPagesLayoutBox";
// import { AxiosError } from "axios";

export function Signin() {
  // authApi
  //   .signin({ email: "user@mail.ru", password: "1234" })
  //   .then((resp) => console.log(resp.data.message))
  //   .catch((error: AxiosError<{ error: string }>) => {
  //     console.log(error.response?.data.error);
  //   });

  return <FormPagesLayoutBox title="Sign in" form={<SigninForm />} />;
}
