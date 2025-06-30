import { api } from "@/shared/api/axios-instance";
import type { IUser } from "../types";
import { ROUTES } from "@/shared/api/constants";
import type { AxiosResponse } from "axios";

interface IUserRequest extends Pick<IUser, "email" | "password"> {}
interface IUserResponse {
    id: number;
    email: string;
}
// что из себя представляет ответ от сервера
interface IUserSignupResponse {
    token: string;
    user: IUserResponse;
}

export const authApi = {
    signin: (data: IUserRequest) =>
        api.post<{ message: string }>(ROUTES.SIGNIN, data),
    signup: (data: IUserRequest) =>
        api.post<IUserSignupResponse>(ROUTES.SIGNUP, data),
};
