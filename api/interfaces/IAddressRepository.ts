import { IAbstractRepository } from "./IAbstractRepository";
import { IAddress } from "./IAddress";

export interface IAddressRepository
  extends Omit<IAbstractRepository<IAddress>, "create"> {
  createWithUserId(userId: string, newAddress: IAddress): Promise<IAddress>;
}
