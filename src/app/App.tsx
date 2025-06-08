import { authApi } from "@/entities/user/api/auth";
import { api } from "@/shared/api/axios-instance";
import { Button } from "@/shared/ui/button";
import axios, { AxiosError } from "axios";
import { error } from "console";

export function App() {
  //   fetch("http://localhost:4000/")
  //     .then((resp) => resp.json())
  //     .then((data) => console.log(data));

  //   ответ на 1 шаг быстрее
  //   axios.get("http://localhost:4000/").then((resp) => console.log(resp));
  //   api.get("/").then((resp) => console.log(resp));
  authApi
    .signin({ email: "user@mail.ru", password: "1234" })
    .then((resp) => console.log(resp.data.message))
    .catch((error: AxiosError<{ error: string }>) => {
      console.log(error.response?.data.error);
    });

  return (
    <>
      {/* <h1 className="text-3xl font-bold underline">Hello world!</h1> */}
      <Button size={"lg"} variant={"outline"}>
        Button
      </Button>
    </>
  );
}

/*
                            ESLint, Prettier
npm i --save-dev - только во время разработки
eslint-import-resolver-typescript - для алиасов
vite-tsconfig-paths - отсылка @ к src
prettier
eslint-plugin-prettier - подружить prettier с eslint
eslint-config-prettier - подружить prettier с eslint
@typescript-eslint/parser
@typescript-eslint/eslint-plugin
eslint-plugin-react
eslint-plugin-import

npm i --save-dev eslint-import-resolver-typescript vite-tsconfig-paths prettier eslint-plugin-prettier eslint-config-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-import 
_______________________________________________________________________

                                tailwindcss
npm install tailwindcss @tailwindcss/vite
_______________________________________________________________________

                                @types/node
npm i -D @types/node
_______________________________________________________________________

                                shadcn
npx shadcn@latest init
_______________________________________________________________________

                                axios
npm i axios
*/
