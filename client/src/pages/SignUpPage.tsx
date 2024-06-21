import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AuthAPI } from "@/api/AuthAPI";
import { useClientStorage } from "@/store/store";

type SignUpData = {
  username: string;
  email: string;
  password: string;
};

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);

  const updateUser = useClientStorage((state) => state.updateUser);
  const updateToken = useClientStorage((state) => state.updateToken);

  const form = useForm();
  const navigate = useNavigate();

  const onSubmit = (data: SignUpData) => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);

    AuthAPI.register(data.username, data.email, data.password).then(
      (payload) => {
        updateUser({
          id: payload.id,
          username: payload.username,
          email: payload.email,
        });
        updateToken(btoa(data.username + ":" + data.password));
        navigate("/");
      }
    );
  };

  return (
    <div className="flex justify-center py-20">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Регистрация</CardTitle>
            <CardDescription>
              Заполните поля для создание аккаунта
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <CardContent>
                <div className="flex flex-col gap-3">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя пользователя</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Почта</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Регистрация
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        <div className="flex justify-center">
          <p className="text-sm">
            Уже есть аккаунт.{" "}
            <span className="text-blue-600 underline underline-offset-2">
              <a href="/auth/signin">Войти</a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
