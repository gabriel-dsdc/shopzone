import { IAbstractRepository } from "./IAbstractRepository";
import { IProduct } from "./IProduct";

export interface IProductRepository
  extends Omit<IAbstractRepository<IProduct>, "create findAll"> {
  create(userId: string, newProduct: IProduct): Promise<IProduct>;
  findAll(): Promise<IProduct[]>;
}
