// путь с / для навигации
import { RouteNames } from "../types";

export const ROUTES = {
    HOME: "/",
    SIGNIN: `/${RouteNames["Signin"]}`,
    SIGNUP: `/${RouteNames["Signup"]}`,
} as const;
