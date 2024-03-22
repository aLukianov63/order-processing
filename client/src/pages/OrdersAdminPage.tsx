import {OrdersAPI} from "@/api/OrdersAPI";
import {useClientStorage} from "@/store/store";
import {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import OrderEditDialog from "@/components/OrderEditDialog";
import {Order} from "@/types/Order";

const OrdersAdminPage = () => {
    const userToken = useClientStorage((state) => state.userToken);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        OrdersAPI.getAll(userToken).then((payload) => {
            setOrders(payload);
        });
    }, [userToken]);

    return (
        <div className="flex justify-center py-40">
            <div className="flex flex-col gap-4">
                <p className="text-3xl font-medium">Список всех заказов</p>
                <Table className="mx-auto max-w-[1200px]">
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.owner.username}</TableCell>
                                <TableCell>
                                    <Badge>{order.orderStatus}</Badge>
                                </TableCell>
                                <TableCell>{order.createAt}</TableCell>
                                <TableCell className="text-right">
                                    {order.details.deliveryAddress}
                                </TableCell>
                                <TableCell>
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
                                        totalPrice={777}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default OrdersAdminPage;
