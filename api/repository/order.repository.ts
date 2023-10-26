import { Model } from "mongoose";
import { IOrder } from "../interfaces/IOrder";
import { IUser } from "../interfaces/IUser";
import { AbstractRepository } from "./abstract.repository";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { ErrorHandler } from "../middlewares/error.middleware";
import { productModel } from "../models/product.model";

export class OrderRepository
  extends AbstractRepository<IOrder>
  implements IOrderRepository
{
  constructor(orderModel: Model<IOrder>, private userModel: Model<IUser>) {
    super(orderModel);
  }

  public async createWithUserId(userId: string, newOrder: IOrder) {
    let result: IOrder | undefined;
    const session = await this.model.startSession();
    await session.withTransaction(async () => {
      const products = await productModel.find({
        _id: { $in: newOrder.products.map((product) => product.id) },
      });

      const sumTotalPrice = products.reduce((accTotalPrice, product) => {
        const orderProduct = newOrder.products.find(
          (orderProduct) => product.id === orderProduct.id
        );
        if (orderProduct) {
          orderProduct.price = product.price;
          orderProduct.stripePriceId = product.stripePriceId;
          return accTotalPrice + product.price * (orderProduct.quantity || 1);
        }
        throw new ErrorHandler("Invalid product ID in your order", 403);
      }, 0);

      result = await this.model
        .create<IOrder>(
          [
            {
              ...newOrder,
              userId,
              totalPrice: Number(sumTotalPrice.toFixed(2)),
            },
          ],
          {
            session: session,
          }
        )
        .then((orders) => orders[0]);

      const userFound = await this.userModel
        .findByIdAndUpdate(userId, { $push: { orders: result?.id } })
        .session(session);
      if (!userFound) {
        throw new ErrorHandler("User not Found", 404);
      }
    });
    await session.endSession();
    if (result) {
      return result;
    } else {
      throw new ErrorHandler("Cannot create a new Order");
    }
  }
}
