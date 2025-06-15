import { authApi } from "@/entities/user/api/auth";
import { SignupForm } from "@/features/auth";
import { FormPagesLayoutBox } from "@/shared/ui/layouts/FormPagesLayoutBox";
import type { AxiosError } from "axios";

export function Signup() {
  return <FormPagesLayoutBox title="Sign up" form={<SignupForm />} />;
}
// npm i @prisma/client
// npx prisma init

// миграция
// npx prisma migrate dev
