import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {Button} from "./ui/button";
import {Pencil1Icon} from "@radix-ui/react-icons";
import {useState} from "react";
import {OrdersAPI} from "@/api/OrdersAPI";
import {Badge} from "./ui/badge";
import {Calendar} from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {format} from "date-fns";
import {Calendar as CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {ru} from "date-fns/locale";
import BusketItem from "./BusketItem";
import {Textarea} from "./ui/textarea";
import {Separator} from "./ui/separator";
import {User} from "@/types/User";
import {OrderLines} from "@/types/OrderLine";

type Props = {
    id: number;
    token: string;
    user: User;
    createdAt: string;
    orderStatus: string;
    lines: OrderLines[];
    person: string;
    address: string;
    phone: string;
    totalPrice: number;
};

const OrderEditDialog = ({
                             id,
                             token,
                             user,
                             createdAt,
                             orderStatus,
                             lines,
                             person,
                             address,
                             phone,
                             totalPrice,
                         }: Props) => {
    const [status, setStatus] = useState(orderStatus);
    const [date, setDate] = useState<Date>();
    const [message, setMessage] = useState("");

    function submite() {
        OrdersAPI.updateById(id, token, {
            status: status,
            message: message,
            deliveryDate: date?.toString(), // fix this
        }).then(() => {
        });
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button size="icon">
                    <Pencil1Icon/>
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[700px] max-w-[1100px]">
                <DialogHeader>
                    <DialogTitle className="flex flex-col gap-5">
                        Заказ №{id} создан {createdAt}
                        <Separator/>
                    </DialogTitle>
                    <DialogDescription>
                        <div className="flex flex-col gap-4 py-5">
                            <p className="font-medium text-black text-[18px]">Информация</p>
                            <div className="flex flex-row gap-10">
                                <p className="text-black text-[16px] font-medium">
                                    Пользователь:{" "}
                                    <span className="underline underline-offset-2">
                    {user.username} ({person})
                  </span>
                                </p>
                                <p className="text-black text-[16px] font-medium">
                                    Номер телефона: {phone}
                                </p>
                                <p className="text-black text-[16px] font-medium">
                                    Почта: {user.email}
                                </p>
                            </div>
                            <p className="text-black text-[16px] font-medium">
                                Адрес доставки: {address}
                            </p>

                            <div className="flex flex-col gap-3">
                                <p className="font-medium text-black text-[18px]">
                                    Состав заказа
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    {lines.map((item) => (
                                        <BusketItem
                                            title={item.product.title}
                                            image={item.product.imageUrl}
                                            price={item.product.price}
                                            quantity={item.quantity}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-black text-[16px] font-medium">
                                Общая сумма заказа: {totalPrice}
                            </p>
                            <div className="flex flex-row gap-10">
                                <div className="flex flex-col gap-4 py-5">
                                    <p className="font-medium text-black text-[18px]">
                                        Текущий статус заказа
                                    </p>
                                    <Select onValueChange={(value) => setStatus(value)}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder={<Badge>{status}</Badge>}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACCEPTED">
                                                <Badge>Выполнено</Badge>
                                            </SelectItem>
                                            <SelectItem value="SEND">
                                                <Badge>Отпралвено</Badge>
                                            </SelectItem>
                                            <SelectItem value="CANCELED">
                                                <Badge>Отменено</Badge>
                                            </SelectItem>
                                            <SelectItem value="DELIVERED">
                                                <Badge>В доставке</Badge>
                                            </SelectItem>
                                            <SelectItem value="IN_PROCESSING">
                                                <Badge>В процессе</Badge>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-4 py-5">
                                    <p className="font-medium text-black text-[18px]">
                                        Дата доставки
                                    </p>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[280px] justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                                {date ? (
                                                    format(date, "PPP")
                                                ) : (
                                                    <span>Выберите дату</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                locale={ru}
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="font-medium text-black text-[18px]">
                                    Написать сообщение
                                </p>
                                <Textarea
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message here."
                                />
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button onClick={submite}>Сохранить</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default OrderEditDialog;
