import { IUser } from "./IUser";
import { IAddress } from "./IAddress";
import { IProduct } from "./IProduct";
import { IPayment } from "./IPayment";

export enum Status {
  Pending = "Pending",
  Shipped = "Shipped",
  Received = "Received",
  Canceled = "Canceled",
}

export interface IOrder {
  id: string;
  userId: IUser["id"];
  status: Status;
  address: IAddress["id"];
  payment: IPayment["id"];
  products: {
    id: IProduct["id"];
    quantity: number;
    price: number;
    stripePriceId: string;
  }[];
  totalPrice: number;
}
