import { api } from "@/shared/api/axios-instance";
import type { IUserPrivate, IUserPublic } from "../types";
import { ROUTES } from "@/shared/api/constants";

interface IUserRequest extends Pick<IUserPrivate, "email" | "password"> {}

// что из себя представляет ответ от сервера
interface IUserResponse {
  user: IUserPublic;
}

export const authApi = {
  // signin: (data: IUserRequest) => api.post<IUserResponse>(ROUTES.SIGNIN, data),
  signin: (data: IUserRequest) => api.post<IUserResponse>(ROUTES.SIGNIN, data),
  signup: (data: IUserRequest) => api.post<IUserResponse>(ROUTES.SIGNUP, data),
  protected: () => api.get<IUserResponse>(ROUTES.PROTECTED),
};
