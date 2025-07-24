import { SigninForm, withCheckAuth } from "@/features/auth";
import { FormPagesLayoutBox } from "@/shared/ui/layouts/FormPagesLayoutBox";

export const Signin = withCheckAuth(() => {
  return <FormPagesLayoutBox title="Sign in" form={<SigninForm />} />;
});
