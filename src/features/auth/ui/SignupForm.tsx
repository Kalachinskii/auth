import { ROUTES } from "@/shared/router/constants";
import { ROUTES as ROUTES_VALUES } from "@/shared/api/constants";
import { FormLayout } from "./layouts/FormLayout";
import { SignupFormSchema } from "../model/formSchema";
import { useAuth } from "../model/useAuth";

export const SignupForm = () => {
  const { authHandler, sererValidationErrors } = useAuth(ROUTES_VALUES.SIGNUP);

  return (
    <FormLayout
      buttonTitle="Sign up"
      onSubmit={authHandler}
      confirmField={true}
      link={{ to: ROUTES.SIGNIN, title: "Sign in" }}
      schema={SignupFormSchema}
      sererValidationErrors={sererValidationErrors}
    />
  );
};
