import { IAddress } from "./IAddress";
import { IOrder } from "./IOrder";
import { IPayment } from "./IPayment";
import { IProduct } from "./IProduct";
import { IReview } from "./IReview";

export enum Role {
  Admin = "admin",
  Client = "client",
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  addresses: IAddress["id"][];
  orders: IOrder["id"][];
  payments: IPayment["id"][];
  products: IProduct["id"][];
  favorites: IProduct["id"][];
  reviews: IReview["id"][];
  stripeCustomerId: string;
}
