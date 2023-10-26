import { Schema } from "mongoose";
import { AbstractModel } from "./abstract.model";
import { IOrder, Status } from "../interfaces/IOrder";

class OrderModel extends AbstractModel<IOrder> {
  constructor() {
    const orderSchema: Schema = new Schema({
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      status: { type: String, enum: Status, default: Status.Pending },
      address: {
        type: Schema.Types.ObjectId,
        ref: "Address",
        required: true,
      },
      products: [
        {
          _id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
          quantity: { type: Number, min: 1, default: 1 },
          price: { type: Number, min: 0, required: true },
          stripePriceId: { type: String, required: true },
        },
      ],
      totalPrice: { type: Number, required: true },
    });
    super("Order", orderSchema);
  }
}

export const orderModel = new OrderModel().model;
