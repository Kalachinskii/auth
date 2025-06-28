import { ROUTES } from "@/shared/router/constants";
import { useSignup } from "../model/useSignup";
import { FormLayout } from "./layouts/FormLayout";
import { SignupFormSchema } from "../model/formSchema";

export const SignupForm = () => {
    const { signupHandler } = useSignup();
    return (
        <FormLayout
            buttonTitle="Sign up"
            onSubmit={signupHandler}
            confirmField={true}
            link={{ to: ROUTES.SIGNIN, title: "Sign in" }}
            schema={SignupFormSchema}
        />
    );
};
