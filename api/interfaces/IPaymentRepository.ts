import { IAbstractRepository } from "./IAbstractRepository";
import { IPayment } from "./IPayment";

export interface IPaymentRepository
  extends Omit<IAbstractRepository<IPayment>, "create"> {
  pay(orderId: string, customerId: string): Promise<string>;
  webhook(payload: string | Buffer, sig: string): Promise<void>;
  // createWithUserId(
  //   userId: string,
  //   newPayment: IPayment
  // ): Promise<Partial<IPayment>>;
}
