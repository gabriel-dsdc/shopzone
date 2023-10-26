import { IAbstractRepository } from "./IAbstractRepository";
import { IOrder } from "./IOrder";

export interface IOrderRepository
  extends Omit<IAbstractRepository<IOrder>, "create"> {
  createWithUserId(userId: string, newOrder: IOrder): Promise<IOrder>;
}
