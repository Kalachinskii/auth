import { FormLayout } from "./layouts/FormLayout";

export const SigninForm = () => {
  const signinHandler = () => {
    console.log("signin");
  };

  return <FormLayout title="Sign in" onSubmit={signinHandler} />;
};
