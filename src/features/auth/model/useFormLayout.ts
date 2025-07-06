import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SigninFormSchema, SignupFormSchema } from "./formSchema";

export const useFormLayout = ({
    schema,
    confirmField,
    sererValidationErrors,
}: BaseFormLayoutProps) => {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            ...(confirmField ? { confirmPassword: "" } : {}),
        },
    });

    const {
        watch,
        formState: { errors, isValid },
    } = form;

    const isPasswordValid = !errors.password && watch("password");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    type FormFields = "email" | "password" | "confirmPassword";

    useEffect(() => {
        // при загрузке странице будет подчёркивать что поле не заполнено
        // form.setError("email", { message: "ERROR" });

        // entries переводит {[],[],[]} в [[],[],[]]
        if (sererValidationErrors) {
            Object.entries(
                sererValidationErrors.forEach(([field, message]) => {
                    // console.log(field);
                    // console.log(message);
                    form.setError(field as keyof z.infer<typeof schema>, {
                        type: "server",
                        message: message.join("\n"),
                    });
                })
            );
        }
    }, [sererValidationErrors]);

    return {
        form,
        showPassword,
        setShowPassword,
        isPasswordValid,
        showConfirmPassword,
        setShowConfirmPassword,
    };
};
