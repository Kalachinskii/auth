import { Signin } from "@/pages/signin";
import { Signup } from "@/pages/signup";
import { ROUTES } from "@/shared/router/constants";
import { Home } from "lucide-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./AppLayout";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Home />,
      },
    ],
  },
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
