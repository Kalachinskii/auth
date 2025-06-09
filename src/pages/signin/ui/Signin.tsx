// import { authApi } from "@/entities/user/api/auth";
import { SigninForm } from "@/features/auth";
// import { AxiosError } from "axios";

export function Signin() {
  // authApi
  //   .signin({ email: "user@mail.ru", password: "1234" })
  //   .then((resp) => console.log(resp.data.message))
  //   .catch((error: AxiosError<{ error: string }>) => {
  //     console.log(error.response?.data.error);
  //   });

  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <main className="border border-zinc-500 rounded-xl bg-blue-200/10 px-8 pt-8 pb-14 min-w-[300px]">
        <h1 className="text-4xl text-white">Sign in</h1>
        <SigninForm />
      </main>
    </div>
  );
}
