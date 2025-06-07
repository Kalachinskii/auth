import { api } from "@/shared/api/axios-instance";
import type { IUser } from "../types";

interface IUserRequest extends Pick<IUser, "email" | "password"> {}

export const signin = (data: IUserRequest) => {
  api.post("/signin", data).then((resp) => console.log(resp.data));
};
