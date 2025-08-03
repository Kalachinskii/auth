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

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Home />,
        loader: async () => {
          try {
            const resp = await authApi.protected();
            // resp.data.user = {id: 6, email: 'asd@gmail.com'}
            return { user: resp.data.user };
          } catch (error) {
            // перенаправление на signin
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
]);

export const AppRouter = () => <RouterProvider router={router} />;
