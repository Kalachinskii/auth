import { Signin } from "@/pages/signin";
import { Signup } from "@/pages/signup";
import { ROUTES } from "@/shared/router/constants";
import { Home } from "lucide-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./AppLayout";

const router = createBrowserRouter([
  {
    // path: ROUTES.HOME,
    // обвертка
    element: <AppLayout />,
    children: [
      // уточнение путей
      {
        path: ROUTES.HOME,
        element: <Home />,
      },
    ],
  },
  //   без обвёртки
  {
    path: ROUTES.SIGNIN,
    element: <Signin />,
  },
  {
    path: ROUTES.SIGNUP,
    element: <Signup />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
