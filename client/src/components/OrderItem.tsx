import { Card } from "@/components/ui/card";
import { Badge } from "./ui/badge";

type Props = {
  title: string;
  image: string;
  price: number;
  quantity: number;
  categoryName: string;
};

const OrderItem = ({ title, image, price, quantity, categoryName }: Props) => {
  return (
    <Card className="flex justify-between w-[500px] h-[100px] p-2">
      <div className="flex flex-row gap-2">
        <img className="rounded-lg h-[80px] w-[80px]" src={image} alt="" />
        <div className="flex flex-col justify-between">
          <p className="font-medium text-lg">{title}</p>
          <p className="font-medium text-lg">
            <Badge className=" rounded-sm" variant="secondary">
              #{categoryName}
            </Badge>
          </p>
          <p className="font-semibold">{price} руб</p>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <p className="text-lg">Количество: {quantity}</p>
      </div>
    </Card>
  );
};

export default OrderItem;
