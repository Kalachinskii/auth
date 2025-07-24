import { SignupForm, withCheckAuth } from "@/features/auth";
import { FormPagesLayoutBox } from "@/shared/ui/layouts/FormPagesLayoutBox";

export const Signup = withCheckAuth(() => {
  return <FormPagesLayoutBox title="Sign up" form={<SignupForm />} />;
});

// npm i @prisma/client
// npx prisma init

// миграция
// npx prisma migrate dev
