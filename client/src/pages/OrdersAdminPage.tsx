import { OrdersAPI } from "@/api/OrdersAPI";
import { useClientStorage } from "@/store/store";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import OrderEditDialog from "@/components/OrderEditDialog";
import { Order } from "@/types/Order";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollText, SheetIcon } from "lucide-react";
import OrderStatus from "@/components/OrderStatus";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrderReport from "@/components/pdf-reports/OrderReport";
import { useAuth } from "@/components/AuthProvider";
import { Toggle } from "@/components/ui/toggle";

type OrderProcessProps = {
  order: Order;
  userId: number;
  userToken: string;
};

const OrderProcess = ({ order, userId, userToken }: OrderProcessProps) => {
  function handleProcess(orderId: number, token: string, admin: number) {
    OrdersAPI.processById(orderId, token, admin).then(() => {});
    window.location.reload();
  }

  if (order.isProcessed) {
    if (order.admin.id === userId) {
      return (
        <OrderEditDialog
          id={order.id}
          token={userToken}
          user={order.owner}
          createdAt={order.createAt}
          orderStatus={order.orderStatus}
          lines={order.lines}
          person={order.details.contactPerson}
          address={order.details.deliveryAddress}
          phone={order.details.mobilePhone}
          totalPrice={order.totalPrice}
        />
      );
    }
  } else
    return (
      <Button onClick={() => handleProcess(order.id, userToken, userId)}>
        Обработать
      </Button>
    );
};

const OrdersAdminPage = () => {
  const user = useAuth();
  const userToken = useClientStorage((state) => state.userToken);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [showNewOrders, setShowNewOrders] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    OrdersAPI.getAll(userToken).then((payload) => {
      setOrders(payload);
    });
  }, [userToken]);

  const handleExport = () => {
    const excelData = orders.map((order) => ({
      "Имя пользователя": order.owner.username,
      "Почта заказчика": order.owner.email,
      "Дата оформления заказа": format(
        new Date(order.createAt),
        "yyyy-MM-dd kk:mm"
      ),
      "Адрес доставки": order.details.deliveryAddress,
      "Мобтльный телефон": order.details.mobilePhone,
      "Текущий статус заказа": order.orderStatus,
      Admin: order.admin ? order.admin.username : "Не назначен",
      "Сумма заказ": order.totalPrice,
      "Количетсво товаров": order.lines.length,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  };

  const filteredOrders = showMyOrders
    ? orders.filter((order) => order.admin?.id === user?.id)
    : showNewOrders
    ? orders.filter((order) => order.orderStatus === "CREATED")
    : orders;

  const handleToggleMyOrders = () => {
    if (showMyOrders) {
      setShowMyOrders(false);
    } else {
      setShowMyOrders(true);
      setShowNewOrders(false);
    }
    setCurrentPage(1);
  };

  const handleToggleNewOrders = () => {
    if (showNewOrders) {
      setShowNewOrders(false);
    } else {
      setShowNewOrders(true);
      setShowMyOrders(false);
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center py-20">
      <div className="flex flex-col gap-20">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Все заказы</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Панель динамических заказов для эффективного управления и
                анализа.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button>+ Добавить заказ</Button>
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>Эта неделя</CardDescription>
              <CardTitle className="text-4xl">
                ₽
                {orders.reduce(function (p, s) {
                  return p + s.totalPrice;
                }, 0)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                9 заказов за последнюю неделю
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={25} aria-label="25% increase" />
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>Этот месяц</CardDescription>
              <CardTitle className="text-4xl">
                {" "}
                ₽
                {orders.reduce(function (p, s) {
                  return p + s.totalPrice;
                }, 0)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                9 заказов за последний месяц
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={12} aria-label="12% increase" />
            </CardFooter>
          </Card>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-4">
              <Input className="w-[300px]" placeholder="Найти заказ ..." />
              <Toggle
                variant="outline"
                aria-label="Toggle my orders"
                pressed={showMyOrders}
                onClick={handleToggleMyOrders}
              >
                Мои заказы
              </Toggle>
              <Toggle
                variant="outline"
                aria-label="Toggle new orders"
                pressed={showNewOrders}
                onClick={handleToggleNewOrders}
              >
                Новые заказы
              </Toggle>
            </div>
            <div className="pr-3.5">
              <Button className="flex flex-row gap-2" onClick={handleExport}>
                Сохранить в Excel <SheetIcon size={20} />
              </Button>
            </div>
          </div>
          <Table className="mx-auto max-w-[1200px]">
            <TableCaption>
              Всего заказов в обработке: {orders.length}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox />
                </TableHead>
                <TableHead className="w-[50px]">Номер</TableHead>
                <TableHead>Дата и время</TableHead>
                <TableHead>Заказчик</TableHead>
                <TableHead>Статус заказа</TableHead>
                <TableHead>Администратор</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Мобильный телефон</TableHead>
                <TableHead>Полная информация</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>№{order.id}</TableCell>
                  <TableCell>
                    {format(new Date(order.createAt), "yyyy-MM-dd kk:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 max-w-[150px]">
                      <div>{order.owner.username}</div>
                      <div className="text-gray-500">{order.owner.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <OrderStatus>{order.orderStatus}</OrderStatus>
                  </TableCell>
                  <TableCell className="text-center">
                    {order.admin ? order.admin.username : "Не назначен"}
                  </TableCell>
                  <TableCell className="text-center">
                    {order.totalPrice} ₽
                  </TableCell>
                  <TableCell className="text-center">
                    {order.details.mobilePhone}
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <div className="flex flex-row gap-3 items-center">
                      <OrderProcess
                        order={order}
                        userId={user?.id}
                        userToken={userToken}
                      />

                      <PDFDownloadLink
                        document={<OrderReport order={order} />}
                        fileName={`отчёт_заказа_${order.id}.pdf`}
                      >
                        {({ loading }) =>
                          loading ? (
                            "..."
                          ) : (
                            <Button className="h-8 w-8" size="icon">
                              <ScrollText size={18} />
                            </Button>
                          )
                        }
                      </PDFDownloadLink>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex flex-row gap-4 mt-6">
            <Button disabled={currentPage === 1} onClick={handlePreviousPage}>
              {"< Предыдущая"}
            </Button>
            <Button
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              {"Следующая >"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersAdminPage;
