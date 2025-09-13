// путь без / для подстановок где нету навигации
import { RouteNames } from "../types";

export const ROUTES = {
  SIGNIN: RouteNames["Signin"],
  SIGNUP: RouteNames["Signup"],
  SIGNOUT: RouteNames["Signout"],
  PROTECTED: RouteNames["Protected"],
  AUTH_GOOGLE: RouteNames["AuthGoogle"],
} as const;
