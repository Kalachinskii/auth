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
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

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
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    // установить npm i @hookform/resolvers
    resolver: zodResolver(FormSchema),
    mode: "onChange", // реал-тайм
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
          // space-y-6 вертикальные отступы между элементами
          // w-2/3 ширина от 100%
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
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
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                      className=""
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y1/2 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-3 w-3 text-gray-500" />
                      ) : (
                        <Eye className="h-3 w-3 text-gray-500" />
                      )}
                    </button>
                  </div>
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
