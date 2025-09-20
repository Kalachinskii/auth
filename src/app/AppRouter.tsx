import { Signin } from "@/pages/signin";
import { Signup } from "@/pages/signup";
import { ROUTES } from "@/shared/router/constants";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { authApi } from "@/entities/user/api/auth";
import { Home } from "@/pages/Home";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { ResetPassword } from "@/pages/ResetPassword";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Home />,
        loader: async () => {
          try {
            // прежде чем пустить на Home проверяем доступ
            const resp = await authApi.protected();
            return { user: resp.data.user };
          } catch (error) {
            // перенаправление на signin если нет доступа
            throw redirect(ROUTES.SIGNIN);
          }
        },
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
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: <ResetPassword />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
