import { FormLayout } from "./layouts/FormLayout";

export const SignupForm = () => {
  const signupHandler = () => {
    console.log("signup");
  };

  return (
    <FormLayout title="Sign in" onSubmit={signupHandler} confirmField={true} />
  );
};
