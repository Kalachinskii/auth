import { ROUTES } from "@/shared/router/constants";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const useCheckToken = () => {
  const navigate = useNavigate();
  const [isToken, setIsToken] = useState(false);
  const [searchParams] = useSearchParams();
  //   console.log(searchParams.get("token"));

  useEffect(() => {
    if (!searchParams.has("token")) {
      navigate(ROUTES.SIGNIN);
    } else {
      setIsToken(true);
    }
  }, [searchParams, navigate]);

  return { isToken };
};
