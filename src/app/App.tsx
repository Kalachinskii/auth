import { Button } from "@/shared/ui/button";

export function App() {
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
