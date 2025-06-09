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
  confirmPassword: z
    .string()
    .min(passwordMin, `Пароль не должен быть меньше ${passwordMin} символов`)
    .max(passwordMax, `Пароль не более ${passwordMax} символов`)
    .regex(/[A-Z]/, "Пароль должен содержать хотябы 1 заглавную букву")
    .regex(/[a-z0-9]/, "Пароль должен содержать цифры и буквы")
    .optional(),
});

type FormData = z.infer<typeof FormSchema>;

interface FormLayoutProps {
  title: string;
  onSubmit: (data: FormData) => void;
  confirmField?: boolean;
}

export const FormLayout = ({
  title,
  onSubmit,
  confirmField,
}: FormLayoutProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<FormData>({
    // установить npm i @hookform/resolvers
    resolver: zodResolver(FormSchema),
    mode: "onChange", // реал-тайм
  });

  //   const onSubmit = () => {
  //     console.log("Submit");
  //   };

  return (
    <div className="mt-5">
      <Form {...form}>
        <form
          //   onSubmit={form.handleSubmit(onSubmit)}
          // space-y-6 вертикальные отступы между элементами
          // w-2/3 ширина от 100%
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel className="text-white">Email</FormLabel> */}
                <FormControl>
                  <Input
                    className="text-white"
                    placeholder="Email"
                    {...field}
                  />
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
                {/* <FormLabel className="text-white">Password</FormLabel> */}
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                      className="text-white"
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

          {confirmField && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel className="text-white">Password</FormLabel> */}
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        {...field}
                        className="text-white"
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
          )}

          <Button
            className="border cursor-pointer border-zinc-500 rounded-xl"
            type="submit"
          >
            {title}
          </Button>
        </form>
      </Form>
    </div>
  );
};
