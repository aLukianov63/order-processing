import { OrdersAPI } from "@/api/OrdersAPI";
import { UserAPI } from "@/api/UserAPI";
import { useClientStorage } from "@/store/store";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { User } from "@/types/User";
import { Order } from "@/types/Order";
import OrderStatus from "@/components/OrderStatus";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowBigDown } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import OrderItem from "@/components/OrderItem";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

function updateUserRole(role: string) {
  if (role === "ROLE_USER") return "Пользователь";
  if (role === "ROLE_ADMIN") return "Администратор";
}

function hide_cansel(order: Order) {
  if (order.orderStatus === "CANCELED" || order.orderStatus === "RECEIVED") {
    return false;
  }
  return true;
}

const UserProfilePage = () => {
  const { toast } = useToast();
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

  const onOrderCansel = (order: Order) => {
    if (
      order.orderStatus === "SENT" ||
      order.orderStatus === "ACCEPTED" ||
      order.orderStatus === "CANCELED"
    ) {
      toast({
        title: "Невозможно отменить заказ!",
      });
      return;
    }
    OrdersAPI.canselById(order.id, userToken).then(() => {});
  };

  return (
    <div className="flex justify-center py-20">
      <div className="flex flex-col gap-2 w-[1200px]">
        <div className="flex flex-row gap-10 items-center">
          <img
            className="w-[265px] h-[265px] rounded-2xl"
            src={
              user
                ? "https://t3.ftcdn.net/jpg/05/87/76/66/360_F_587766653_PkBNyGx7mQh9l1XXPtCAq1lBgOsLl6xH.jpg"
                : "loading"
            }
          />
          <div className="flex flex-col gap-2 text-lg">
            <div className="flex flex-row text-3xl gap-2">
              <p className="font-bold">{user ? user.username : "loading..."}</p>
              <p className="underline">
                ID#
                {user ? user.id : "loading..."}
              </p>
            </div>
            <p>Почта: {user ? user.email : "loading..."}</p>
            <p>Роль: {user ? updateUserRole(user.role) : "loading..."}</p>
            <p>
              Дата создания аккаунта:{" "}
              {user
                ? format(Date(user.createAt), "yyyy-MM-dd kk:mm")
                : "loading..."}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 py-10">
          <p className="text-3xl font-bold">Ваши заказы</p>
          <Table>
            <TableCaption>Всего заказов: {orders.length}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Номер</TableHead>
                <TableHead>Дата заказа</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Обшая сумма</TableHead>
                <TableHead>Дата доставки</TableHead>
                <TableHead>Информация</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <Collapsible key={order.id} asChild>
                  <>
                    <TableRow>
                      <TableCell>№{order.id}</TableCell>
                      <TableCell>
                        {format(new Date(order.createAt), "yyyy-MM-dd kk:mm")}
                      </TableCell>
                      <TableCell>
                        <OrderStatus>{order.orderStatus}</OrderStatus>
                      </TableCell>

                      <TableCell>{order.totalPrice} ₽</TableCell>
                      <TableCell>
                        {order.details.deliveryDate
                          ? format(
                              Date(order.details.deliveryDate),
                              "yyyy-MM-dd"
                            )
                          : "Дата уточняется"}
                      </TableCell>
                      <TableCell className=" text-right">
                        <CollapsibleTrigger>
                          <Button className="h-[30px] w-[30px]" size="icon">
                            <ArrowBigDown size={20} />
                          </Button>
                        </CollapsibleTrigger>
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <TableRow>
                        <TableCell colSpan={6}>
                          <div className="flex flex-col gap-5">
                            <p className="font-bold text-[20px]">
                              Состав заказа
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {order.lines.map((line) => (
                                <OrderItem
                                  title={line.product.title}
                                  image={line.product.imageUrl}
                                  price={line.product.price}
                                  quantity={line.quantity}
                                  categoryName={line.product.category.name}
                                />
                              ))}
                            </div>
                            <div className="py-5 flex flex-row justify-between">
                              <p>
                                Дополнительная информация:{" "}
                                <Badge className=" rounded-sm">
                                  {order.details.message}
                                </Badge>
                              </p>
                              {hide_cansel(order) && (
                                <AlertDialog>
                                  <AlertDialogTrigger>
                                    <Button variant="destructive">
                                      Отменить заказ
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Вы хотите отменить заказ?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Заказ можно отменить до того как у него
                                        будет статус{" "}
                                        <OrderStatus>SENT</OrderStatus>
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Отмена
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => onOrderCansel(order)}
                                      >
                                        Продолжить
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
          <div className="flex flex-row gap-4 mt-6">
            <Button>{"< Предыдущая"}</Button>
            <Button>{"Cледующая >"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
