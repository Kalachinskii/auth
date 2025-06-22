import { ROUTES } from "@/shared/router/constants";
import { useSignup } from "../model/useSignup";
import { FormLayout } from "./layouts/FormLayout";

export const SignupForm = () => {
    const signupHandler = (data: FormData) => {
        useSignup();
    };

    return (
        <FormLayout
            link={{ to: ROUTES.SIGNIN, title: "Sign in" }}
            buttonTitle="Sign in"
            onSubmit={signupHandler}
            confirmField={true}
        />
    );
};
