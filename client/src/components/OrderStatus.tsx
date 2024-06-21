import { PropsWithChildren } from "react";
import { Badge } from "./ui/badge";
import { translate_status } from "@/utils/utils";

type Props = PropsWithChildren;

const OrderStatus = ({ children }: Props) => {
  switch (children) {
    case "RECEIVED":
      return (
        <Badge className="bg-green-600 hover:bg-green-600">
          {translate_status(children)}
        </Badge>
      );
    case "SENT":
      return (
        <Badge className="bg-blue-600 hover:bg-blue-600">
          {translate_status(children)}
        </Badge>
      );
    case "CANCELED":
      return (
        <Badge className="bg-red-600 hover:bg-red-600">
          {translate_status(children)}
        </Badge>
      );
    case "CREATED":
      return (
        <Badge className="bg-purple-600 hover:bg-purple-600">
          {translate_status(children)}
        </Badge>
      );
    case "PROCESSED":
      return (
        <Badge className="bg-orange-600 hover:bg-orange-600">
          {translate_status(children)}
        </Badge>
      );
    case "COLLECTED":
      return (
        <Badge className="bg-teal-600 hover:bg-teal-600">
          {translate_status(children)}
        </Badge>
      );
    default:
      return "error";
  }
};

export default OrderStatus;
