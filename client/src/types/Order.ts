import { OrderDetails } from "./OrderDetails";
import { OrderLines } from "./OrderLine";
import { User } from "./User";

export type Order = {
  id: number;
  owner: User;
  admin: User;
  isProcessed: boolean;
  details: OrderDetails;
  lines: OrderLines[];
  totalPrice: number;
  orderStatus: string;
  createAt: string;
};
