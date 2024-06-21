import { BasketAPI } from "@/api/BasketAPI";
import { useAuth } from "@/components/AuthProvider";
import BusketItem from "@/components/BusketItem";
import { Button } from "@/components/ui/button";
import { useClientStorage } from "@/store/store";
import { Basket } from "@/types/Basket";
import { BasketItem } from "@/types/BasketItem";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PaymentAPI } from "@/api/PaymentAPI";

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

  function handle() {
    PaymentAPI.create(busket?.totalPrice, userToken, "Заказ №1", user?.id).then(
      (data) => {
        window.open(data.confirmation.confirmation_url);
      }
    );
  }

  return (
    <div className="flex justify-center py-20">
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
                    categoryName={item.product.category.name}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-10 py-10">
            <div className="flex flex-col gap-4">
              <Button onClick={handle} className="w-[350px] h-[50px]">
                Оформить заказ
              </Button>
              <p className=" font-medium">
                Обшая сумма заказа:{" "}
                <span className=" font-bold">
                  {busket ? busket.totalPrice : "loading"} руб
                </span>
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Информация о заказе</CardTitle>
                <CardDescription>
                  Введите информация для доставки
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-5">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Имя получателя</Label>
                    <Input type="email" id="email" placeholder="Иванов Иван" />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="phone">Номер телефона</Label>
                    <Input
                      type="tel"
                      id="phone"
                      placeholder="+7(123)-456-78-90"
                    />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="addres">Адрес доставки</Label>
                    <Textarea
                      id="addres"
                      placeholder="​Комсомольская площадь, 1, Самара"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBasketPage;
