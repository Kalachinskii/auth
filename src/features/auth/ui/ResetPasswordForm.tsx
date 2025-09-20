import { Button } from "@/shared/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Spinner } from "@/shared/ui/spinner";
import { Toaster } from "sonner";
import { useResetPassword } from "../model/useResetPassword";
import { Eye, EyeOff } from "lucide-react";

export const ResetPasswordForm = () => {
  const {
    form,
    isValid,
    isDirty,
    isSubmitting,
    onSubmit,
    showPassword,
    setShowPassword,
  } = useResetPassword();

  return (
    <div>
      <Form {...form}>
        <Toaster />
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="text-zinc-500 group-focus-within:text-zinc-50">
                  Введите новый пароль
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="border-zinc-500 focus:border-zinс-50 text-zinc-50 pl-9"
                      type={showPassword ? "text" : "password"} // Переключаем тип поля ввода
                      placeholder="Password"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)} // Переключаем видимость пароля
                    >
                      {showPassword ? (
                        <EyeOff className="h-3 w-3 text-gray-500" /> // Иконка "глаз закрыт"
                      ) : (
                        <Eye className="h-3 w-3 text-gray-500" /> // Иконка "глаз открыт"
                      )}
                    </button>
                    <span className="w-5 h-5 bg-[url(https://api.iconify.design/hugeicons:square-lock-password.svg?color=%23626060)] bg-no-repeat bg-cover absolute top-2/7 left-2 group-focus-within:bg-[url(https://api.iconify.design/hugeicons:square-lock-password.svg?color=%23ffffff)]"></span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full bg-[#2859FE] py-6 cursor-pointer hover:bg-[#1642d3]"
            type="submit"
            disabled={!isDirty || !isValid || isSubmitting}
          >
            {isSubmitting ? <Spinner size={"small"} /> : "Отправить"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
