import { api } from "@/shared/api/axios-instance";
import type { IUser } from "../types";
import { ROUTES } from "@/shared/api/constants";
import Cookies from "js-cookie";

interface IUserRequest extends Pick<IUser, "email" | "password"> {}
interface IUserData {
    id: number;
    email: string;
}
// что из себя представляет ответ от сервера
interface IUserResponse {
    token: string;
    user: IUserData;
}

export const authApi = {
    signin: (data: IUserRequest) =>
        api.post<IUserResponse>(ROUTES.SIGNIN, data),
    signup: (data: IUserRequest) =>
        api.post<IUserResponse>(ROUTES.SIGNUP, data),
    protected: () =>
        api.get(ROUTES.PROTECTED, {
            headers: {
                // описываем токен
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        }),
};
