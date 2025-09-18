import { SigninForm, withCheckAuth } from "@/features/auth";
import { useAuthFail } from "@/shared/lib/useAuthFail";
import { FormPagesLayoutBox } from "@/shared/ui/layouts/FormPagesLayoutBox";

export const Signin = withCheckAuth(() => {
  // забераем гет параметры с урла и вывод тостера при ошибке
  useAuthFail();

  return <FormPagesLayoutBox title="Sign in" form={<SigninForm />} />;
});
