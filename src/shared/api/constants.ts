// путь без / для подстановок где нету навигации
import { RouteNames } from "../types";

export const ROUTES = {
    SIGNIN: RouteNames["Signin"],
    SIGNUP: RouteNames["Signup"],
    PROTECTED: RouteNames["Protected"],
} as const;
