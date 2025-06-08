import { api } from "@/shared/api/axios-instance";
import type { IUser } from "../types";
import { ROUTES } from "@/shared/api/constants";

interface IUserRequest extends Pick<IUser, "email" | "password"> {}

export const authApi = {
  signin: (data: IUserRequest) =>
    api.post<{ message: string }>(ROUTES.SIGNIN, data),
  signup: (data: IUserRequest) =>
    api.post<{ message: string }>(ROUTES.SIGNUP, data),
};
