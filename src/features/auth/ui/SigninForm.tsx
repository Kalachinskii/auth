import { ROUTES } from "@/shared/router/constants";
import { FormLayout } from "./layouts/FormLayout";
import { SigninFormSchema } from "../model/formSchema";
import { useSignin } from "../model/useSignin";
// import { useSignin } from "../model/useSignin";

export const SigninForm = () => {
    const { signinHandler } = useSignin();
    return (
        <FormLayout
            buttonTitle="Sign in"
            onSubmit={signinHandler}
            link={{ to: ROUTES.SIGNUP, title: "Sign up" }}
            schema={SigninFormSchema}
        />
    );
};
