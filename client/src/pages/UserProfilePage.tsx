import {OrdersAPI} from "@/api/OrdersAPI";
import {UserAPI} from "@/api/UserAPI";
import {useClientStorage} from "@/store/store";
import {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {Button} from "@/components/ui/button";
import {User} from "@/types/User";
import {Order} from "@/types/Order";

const UserProfilePage = () => {
    const userToken = useClientStorage((state) => state.userToken);
    const [user, setUser] = useState<User>();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        UserAPI.me(userToken).then((user) => {
            setUser(user);
            OrdersAPI.getByUserId(user.id, userToken).then((orders) => {
                setOrders(orders);
            });
        });
    }, [userToken]);

    return (
        <div className="flex justify-center py-40">
            <div className="flex flex-col gap-2 w-[1000px]">
                <div className="flex flex-row text-3xl gap-2">
                    <p className="font-bold">{user ? user.username : "loading..."}</p>
                    <p>
                        ID#
                        {user ? user.id : "loading..."}
                    </p>
                </div>
                <p>Почта: {user ? user.email : "loading..."}</p>
                <p>Роль: {user ? user.role : "loading..."}</p>
                <p>Дата создания аккаунта: {user ? user.createAt : "loading..."}</p>
                <div className="flex flex-col gap-3 py-10">
                    <p className="text-3xl font-bold">Заказы</p>
                    {orders.map((order) => (
                        <Collapsible>
                            <CollapsibleTrigger>
                                {" "}
                                <div className="flex flex-row gap-2 items-center">
                                    <p>№{order.id}</p>
                                    <Badge>{order.orderStatus}</Badge>
                                    <p>{order.createAt}</p>
                                    <p>{order.details.deliveryAddress}</p>
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="flex flex-col gap-4 py-10">
                                    <p>Дата доставки: {order.details.deliveryDate}</p>
                                    <p>сообщение: {order.details.message}</p>
                                    <p>Общая сумма заказа: fix this</p>
                                    <div className="flex justify-end px-32">
                                        <Button className="bg-red-600">Отменить заказ</Button>
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
