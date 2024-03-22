import {BasketAPI} from "@/api/BasketAPI";
import {useAuth} from "@/components/AuthProvider";
import BusketItem from "@/components/BusketItem";
import {Button} from "@/components/ui/button";
import {useClientStorage} from "@/store/store";
import {Basket} from "@/types/Basket";
import {BasketItem} from "@/types/BasketItem";
import {useEffect, useState} from "react";

const UserBasketPage = () => {
    const user = useAuth();
    const userToken = useClientStorage((state) => state.userToken);
    const [busket, setBasket] = useState<Basket>();
    const [items, setItems] = useState<BasketItem[]>([]);

    useEffect(() => {
        BasketAPI.getById(user?.id, userToken).then((payload) => {
            setBasket(payload);
            setItems(payload.basketItems);
        });
    }, [user?.id, userToken]);

    return (
        <div className="flex justify-center py-40">
            <div className="flex flex-col gap-14">
                <p className="text-3xl font-bold">Корзина</p>
                <div className="flex flex-row w-[1000px] justify-between">
                    <div className="flex flex-col gap-4 w-[500px]">
                        <p>Элементы корзины</p>
                        <div className="flex flex-col gap-2 w-[1000px]">
                            {items.map((item) => (
                                <div className="flex flex-row gap-4">
                                    <BusketItem
                                        title={item.product.title}
                                        image={item.product.imageUrl}
                                        price={item.totalPrice}
                                        quantity={item.quantity}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Button className="w-[300px] h-[50px]">Оформить заказ</Button>
                        <p className=" font-medium">
                            Обшая сумма заказа:{" "}
                            <span className=" font-normal">
                {busket ? busket.totalPrice : "loading"} руб
              </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserBasketPage;
