import { type PropsWithChildren, type ReactElement } from "react";

export const withCheckAuth = <T,>(Component: (props: T) => ReactElement) => {
  return (props: PropsWithChildren<T>) => {
    return <Component {...props} />;
  };
};
