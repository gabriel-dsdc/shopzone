import { IAbstractRepository } from "./IAbstractRepository";
import { IUser } from "./IUser";

export interface IUserRepository extends IAbstractRepository<IUser> {
  login(filter: Partial<IUser>): Promise<IUser | null>;
  create(data: IUser): Promise<IUser>;
}
