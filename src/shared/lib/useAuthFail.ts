import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useAuthFail = () => {
  const [searchParams] = useSearchParams();
  // console.log(searchParams.get("google_auth_error")); - true

  useEffect(() => {
    if (searchParams.get("google_auth_error")) {
      toast.error("Неудачная авторизация. Попробуйте еще-раз");
    }
  }, [searchParams]);
};
