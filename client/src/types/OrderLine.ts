import {Product} from "./Product";

export type OrderLines = {
    id: number;
    product: Product;
    quantity: number;
};
