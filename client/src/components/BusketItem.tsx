import {Card} from "@/components/ui/card";

type Props = {
    title: string;
    image: string;
    price: number;
    quantity: number;
};

const BusketItem = ({title, image, price, quantity}: Props) => {
    return (
        <Card className="flex justify-between w-[500px] h-[90px] p-2">
            <div className="flex flex-row gap-2">
                <img className="rounded-lg h-[70px] w-[70px]" src={image} alt=""/>
                <div className="flex flex-col justify-between">
                    <p className="font-medium text-lg">{title}</p>
                    <p>{price} руб</p>
                </div>
            </div>
            <div>{quantity}</div>
        </Card>
    );
};

export default BusketItem;
