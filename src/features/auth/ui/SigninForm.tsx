import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ZOD константы
const emaildMin = 5;
const passwordMin = 4;
const passwordMax = 20;
// описать ZOD
const FormSchema = z.object({
  email: z
    .string()
    .email()
    .min(emaildMin, `Почта не должнабыть меньше ${emaildMin} символов`),
  password: z
    .string()
    .min(passwordMin, `Пароль не должен быть меньше ${passwordMin} символов`)
    .max(passwordMax, `Пароль не более ${passwordMax} символов`)
    .regex(/[A-Z]/, "Пароль должен содержать хотябы 1 заглавную букву")
    .regex(/[a-z0-9]/, "Пароль должен содержать цифры и буквы"),
});

export const SigninForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    // установить npm i @hookform/resolvers
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = () => {
    console.log("Submit");
  };

  return (
    <div>
      <label htmlFor=""> SigninForm</label>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};
