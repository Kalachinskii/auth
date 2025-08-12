import { authApi, useUserStore } from "@/entities/user";
import { ROUTES } from "@/shared/router/constants";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useSignout = () => {
  const navigate = useNavigate();
  const signoutUser = useUserStore((state) => state.signoutUser);

  const signoutHandler = async () => {
    try {
      await authApi.signout();
      signoutUser();
      navigate(ROUTES.SIGNIN);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data.error);
    }
  };

  return { signoutHandler };
};
