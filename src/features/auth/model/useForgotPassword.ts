import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailFormSchema } from "./formSchema";
import { authApi } from "@/entities/user";
import { toast } from "sonner";

export const useFargotPassword = () => {
  type FormData = z.infer<typeof emailFormSchema>;

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
      toast.success("На вашу почту оправлена ссылка на востановление пароля");
      //   navigate(ROUTES.HOME);
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
  };
};
