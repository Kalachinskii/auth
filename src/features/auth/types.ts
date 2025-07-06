import { z } from "zod";
import type { SignupFormSchema } from "./model/formSchema";

type FormFieldsKeys = keyof z.infer<typeof SignupFormSchema>;

export type ValidationFormFieldTypes = {
    [k in FormFieldsKeys]?: string[];
};
