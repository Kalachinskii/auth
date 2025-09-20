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
import { useFargotPassword } from "../model/useForgotPassword";

export const ForgotPasswordForm = () => {
  const { form, isValid, isDirty, isSubmitting, onSubmit, buttonDisabled } =
    useFargotPassword();

  return (
    <div>
      <Form {...form}>
        <Toaster />
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="text-zinc-500 group-focus-within:text-zinc-50">
                  Введите почту что-бы збросить пароль
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Email"
                      {...field}
                      className="border-zinc-500 focus:border-zink-50 text-zinc-50 pl-9"
                    />
                    <span className="w-5 h-4 bg-[url(https://api.iconify.design/ic:outline-mail.svg?color=%23626060)] bg-no-repeat bg-cover absolute top-2/7 left-2 group-focus-within:bg-[url(https://api.iconify.design/ic:outline-mail.svg?color=%23ffffff)]"></span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full bg-[#2859FE] py-6 cursor-pointer hover:bg-[#1642d3]"
            type="submit"
            disabled={!isDirty || !isValid || isSubmitting || buttonDisabled}
          >
            {isSubmitting ? <Spinner size={"small"} /> : "Отправить"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
