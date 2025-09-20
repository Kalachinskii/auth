import { ResetPasswordForm } from "@/features/auth";
import { FormPagesLayoutBox } from "@/shared/ui/layouts/FormPagesLayoutBox";
import { useCheckToken } from "../model/useCheckToken";
import { Spinner } from "@/shared/ui/spinner";

export const ResetPassword = () => {
  const { isToken } = useCheckToken();

  if (!isToken)
    return (
      <div className="min-h-screen flex justify-center">
        <Spinner />
      </div>
    );

  return (
    <FormPagesLayoutBox
      title="Создать новый пароль"
      form={<ResetPasswordForm />}
    />
  );
};
