import { z } from "zod";

const formSchemaConst = {
    emailMin: 6,
    passwordMin: 4,
    passwordMax: 20,
} as const;

const BaseFormSchema = z.object({
    email: z
        .string()
        .email()
        .min(
            formSchemaConst.emailMin,
            `Email must be at least ${formSchemaConst.emailMin} characters.`
        ),
    password: z
        .string()
        .min(
            formSchemaConst.passwordMin,
            `Password must not be less than ${formSchemaConst.passwordMin} characters.`
        )
        .max(
            formSchemaConst.passwordMax,
            `Password must not be more than ${formSchemaConst.passwordMax} characters.`
        )
        .regex(/[A-Z]/, "Password must contain capital characters.")
        .regex(/[a-z]/, "Password must contain small characters.")
        .regex(/[0-9]/, "Password must contain numeric characters."),
});

export const SignupFormSchema = BaseFormSchema.extend({
    confirmPassword: z
        .string()
        .min(
            formSchemaConst.passwordMin,
            `Password must not be less than ${formSchemaConst.passwordMin} characters.`
        )
        .max(
            formSchemaConst.passwordMax,
            `Password must not be more than ${formSchemaConst.passwordMax} characters.`
        )
        .regex(/[A-Z]/, "Password must contain capital characters.")
        .regex(/[a-z]/, "Password must contain small characters.")
        .regex(/[0-9]/, "Password must contain numeric characters."),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const SigninFormSchema = BaseFormSchema;
export type SigninFormData = z.infer<typeof SigninFormSchema>;
export type SignupFormData = z.infer<typeof SignupFormSchema>;
