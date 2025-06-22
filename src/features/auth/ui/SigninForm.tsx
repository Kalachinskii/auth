import { ROUTES } from "@/shared/router/constants";
import { FormLayout } from "./layouts/FormLayout";
import useSignin from "../model/useSignin";
import { SigninFormSchema, type SigninFormData } from "../types";

export const SigninForm = () => {
    const { signinHandler } = useSignin();

    return (
        <FormLayout
            link={{ to: ROUTES.SIGNUP, title: "Sign up" }}
            buttonTitle="Sign in"
            onSubmit={signinHandler}
            route={ROUTES.SIGNIN}
            // formSchema={SigninFormSchema}
            // formData={type SigninFormData}
        />
    );
};
