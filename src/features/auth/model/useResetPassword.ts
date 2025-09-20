import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordFormSchema } from "./formSchema";
import { authApi } from "@/entities/user";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/shared/router/constants";
import { useState } from "react";

export const useResetPassword = () => {
  type FormData = z.infer<typeof passwordFormSchema>;
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: zodResolver(passwordFormSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
    },
  });

  const {
    formState: { isValid, isDirty, isSubmitting },
  } = form;

  const onSubmit = async (data: FormData) => {
    const token = searchParams.get("token");

    try {
      if (!data.password || !token) throw new Error("Do not access this page");
      await authApi.resetPassword({ password: data.password, token });
      navigate(ROUTES.SIGNIN, { state: { isPasswordReset: true } });
    } catch (err) {
      toast.error("Невозможно задать новый пароль, попробуйте снова");
    }
  };

  return {
    onSubmit,
    form,
    isValid,
    isDirty,
    isSubmitting,
    showPassword,
    setShowPassword,
  };
};
