import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailFormSchema } from "./formSchema";
import { authApi } from "@/entities/user";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/router/constants";
import { useState } from "react";

export const useFargotPassword = () => {
  type FormData = z.infer<typeof emailFormSchema>;
  const navigate = useNavigate();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(emailFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const {
    formState: { isValid, isDirty, isSubmitting },
  } = form;

  const onSubmit = async (data: FormData) => {
    try {
      // отправляет на сервер введенную почту
      await authApi.forgotPassword(data);
      setButtonDisabled(true);
      toast.success("На вашу почту оправлена ссылка на востановление пароля");
      setTimeout(() => {
        navigate(ROUTES.SIGNIN);
      }, 4000);
    } catch (err) {
      toast.error("Невозможно найти вашу почту");
    }
  };

  return {
    onSubmit,
    form,
    isValid,
    isDirty,
    isSubmitting,
    buttonDisabled,
  };
};
