import { z } from "zod";
import type { SigninFormSchema, SignupFormSchema } from "./model/formSchema";

// из зода дёргаем type
type FormFieldsKeys = keyof z.infer<typeof SignupFormSchema>;

export type ValidationFormFieldTypes = {
    [k in FormFieldsKeys]?: string[];
};

export interface BaseFormLayoutProps {
    schema: typeof SigninFormSchema | typeof SignupFormSchema;
    confirmField?: boolean;
    sererValidationErrors: ValidationFormFieldTypes | null;
}
