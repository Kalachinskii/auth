import { ROUTES } from "@/shared/router/constants";
import { FormLayout } from "./layouts/FormLayout";
import { SigninFormSchema } from "../model/formSchema";
import { ROUTES as ROUTES_VALUES } from "@/shared/api/constants";
import { useAuth } from "../model/useAuth";

export const SigninForm = () => {
  const { authHandler, sererValidationErrors } = useAuth(ROUTES_VALUES.SIGNIN);
  return (
    <FormLayout
      buttonTitle="Sign in"
      onSubmit={authHandler}
      link={{ to: ROUTES.SIGNUP, title: "Sign up" }}
      schema={SigninFormSchema}
      sererValidationErrors={sererValidationErrors}
      forgotPassword={true}
    />
  );
};
