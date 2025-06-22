import { Button } from "@/shared/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/router/constants";
import { SigninFormSchema, type SigninFormData } from "../../types";

interface FormLayoutProps {
    buttonTitle: string;
    onSubmit: (data: FormData) => void;
    confirmField?: boolean;
    link: {
        to: string;
        title: string;
    };
    route: typeof ROUTES.SIGNIN | typeof ROUTES.SIGNUP;
}

export const FormLayout = ({
    buttonTitle,
    onSubmit,
    confirmField,
    link,
    route,
}: FormLayoutProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<{ route === ROUTES.SIGNIN ? SigninFormData }>({
        resolver: zodResolver({ formSchema }),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            ...(confirmField ? { confirmPassword: "" } : {}),
        },
    });

    // Показывать поле  Confirm password при заполненом валидированном пароле
    const {
        watch,
        formState: { errors },
    } = form;
    const isPasswordValid = !errors.password && watch("password");

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 mb-5"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="group">
                                <FormLabel className="text-zinc-500 group-focus-within:text-zinc-50">
                                    Login
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder="Email"
                                            {...field}
                                            className="border-zinc-500 focus:border-zinc-50 text-zinc-50 pl-9"
                                        />
                                        <span className="w-5 h-4 bg-[url(https://api.iconify.design/ic:outline-mail.svg?color=%23626060)] bg-no-repeat bg-cover absolute top-2/7 left-2 group-focus-within:bg-[url(https://api.iconify.design/ic:outline-mail.svg?color=%23ffffff)]"></span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="group">
                                <FormLabel className="text-zinc-500 group-focus-within:text-zinc-50 ">
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            className="border-zinc-500 focus:border-zinс-50 text-zinc-50 pl-9"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            } // Переключаем тип поля ввода
                                            placeholder="Password"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            } // Переключаем видимость пароля
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
                    {confirmField && isPasswordValid && (
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="group">
                                    <FormLabel className="text-zinc-500 group-focus-within:text-zinc-50 ">
                                        Confirm password
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                className="border-zinc-500 focus:border-zinс-50 text-zinc-50 pl-9"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                } // Переключаем тип поля ввода
                                                placeholder="Confirm password"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (prev) => !prev
                                                    )
                                                } // Переключаем видимость пароля
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
                    )}
                    <Button
                        className="w-full bg-[#2859FE] py-6 cursor-pointer hover:bg-[#1642d3]"
                        type="submit"
                    >
                        {buttonTitle}
                    </Button>
                </form>
                <Button
                    variant={"link"}
                    className="text-[#5a7ef5] block m-auto"
                >
                    <Link to={link.to}>{link.title}</Link>
                </Button>
            </Form>
        </div>
    );
};

/*const form = useForm<TypeOf<T>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(confirmField 
        ? { email: '', password: '', confirmPassword: '' }
        : { email: '', password: '' }
    ) as TypeOf<T>,
  });