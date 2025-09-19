import { ForgotPasswordForm } from "@/features/auth";
import { FormPagesLayoutBox } from "@/shared/ui/layouts/FormPagesLayoutBox";

export const ForgotPassword = () => {
  return (
    <FormPagesLayoutBox
      title="Востановить пароль ?"
      form={<ForgotPasswordForm />}
    />
  );
};
