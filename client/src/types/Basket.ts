import {BasketItem} from "./BasketItem";

export type Basket = {
    id: number;
    items: BasketItem[];
    totalPrice: number;
};
