import {Product} from "./Product";

export type BasketItem = {
    product: Product;
    quantity: number;
    totalPrice: number;
};
