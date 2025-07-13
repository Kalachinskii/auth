import { Signin } from "@/pages/signin";
import { Signup } from "@/pages/signup";
import { ROUTES } from "@/shared/router/constants";
import { Home } from "lucide-react";
import {
    createBrowserRouter,
    redirect,
    RouterProvider,
} from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { authApi } from "@/entities/user/api/auth";
// import { Home } from "@/pages/Home";

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            {
                path: ROUTES.HOME,
                element: <Home />,
                loader: async () => {
                    try {
                        const resp = authApi.protected();
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
