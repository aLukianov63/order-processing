import {AuthAPI} from "@/api/AuthAPI";
import {Button} from "@/components/ui/button";
import {ReloadIcon} from "@radix-ui/react-icons";
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useClientStorage} from "@/store/store";

type SignInData = {
    username: string;
    password: string;
};

const SignInPage = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const updateUser = useClientStorage((state) => state.updateUser);
    const updateToken = useClientStorage((state) => state.updateToken);

    const form = useForm();
    const navigate = useNavigate();

    const onSubmit = (data: SignInData) => {
        setError(false);
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);

        AuthAPI.login(data.username, data.password)
            .then((payload) => {
                updateUser({
                    id: payload.id,
                    username: payload.username,
                    email: payload.email,
                });
                updateToken(btoa(data.username + ":" + data.password));
                navigate("/");
            })
            .catch(() => {
                setError(true);
            });
    };

    return (
        <div className="flex justify-center py-20">
            <Card>
                <CardHeader>
                    <CardTitle>Войти</CardTitle>
                    <CardDescription>
                        Введите учётные данны для входа в аккаунт
                    </CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <CardContent>
                            <div className="flex flex-col gap-3">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Имя пользователя</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field} />
                                            </FormControl>
                                            <FormDescription className=" text-red-700">
                                                {error && "this is error message"}
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Пароль</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormDescription className=" text-red-700">
                                                {error && "this is error message"}
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && (
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                )}
                                Войти
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default SignInPage;
