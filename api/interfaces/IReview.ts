import { Document } from "mongoose";
import { IUser } from "./IUser";
import { IProduct } from "./IProduct";

export interface IReview {
  id: string;
  userId: IUser["id"];
  productId: IProduct["id"];
  title: string;
  description: string;
  rating: number;
}
