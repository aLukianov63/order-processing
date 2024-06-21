import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";

const Product = ({ product }) => {
  return (
    <Card className="max-w-xs mx-auto">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <p className="mt-4">{product.description}</p>
        <p className="mt-2 text-lg font-semibold">{product.price} ₽</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => {
            toast({
              variant: "destructive",
              title: "Данного товара нет в наличии.",
              description:
                "К сожалению данного товара нет в наличии, выберите другой.",
            });
          }}
        >
          Купить
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Product;
