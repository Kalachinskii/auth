import { authApi } from "@/entities/user/api/auth";
import { ROUTES } from "@/shared/router/constants";
import { Spinner } from "@/shared/ui/spinner";
import {
  useEffect,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import { useNavigate } from "react-router-dom";

// добавление функционала к существующему компаненту
export const withCheckAuth = <T,>(Component: (props: T) => ReactElement) => {
  return (props: PropsWithChildren<T>) => {
    // проверки
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      (async () => {
        try {
          const resp = await authApi.protected();
          navigate(ROUTES.HOME);
          setLoading((prev) => !prev);
        } catch (error) {
          console.log("error");
          setLoading((prev) => !prev);
        }
      })();
    }, []);

    if (loading)
      return (
        <div className="min-h-screen flex justify-center">
          <Spinner />
        </div>
      );
    return <Component {...props} />;
  };
};

// export function withCheckAuth(Component: any) {
//   return function (props: any) {
//     const status = false;

//     if (status === false) return <h1>нет доступа</h1>;

//     return <Component {...props} />;
//   };
// }
