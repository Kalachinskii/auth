import { useSignup } from "../model/useSignup";
import { FormLayout } from "./layouts/FormLayout";

export const SignupForm = () => {
  const signupHandler = (data: FormData) => {
    useSignup();
  };

  return (
    <FormLayout
      buttonTitle="Sign in"
      onSubmit={signupHandler}
      confirmField={true}
    />
  );
};
