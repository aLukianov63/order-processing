import {OrderDetails} from "./OrderDetails";
import {OrderLines} from "./OrderLine";
import {User} from "./User";

export type Order = {
    id: number;
    owner: User;
    details: OrderDetails;
    lines: OrderLines[];
    orderStatus: string;
    createAt: string;
};
