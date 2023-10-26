import { IAdmin } from "./IAdmin";
import { IUser } from "./IUser";

export interface IAdminRepository {
  getConfigs(): Promise<IAdmin>;
  updateConfigs(newConfig: IAdmin): Promise<IAdmin>;
  findAll(queries: IUser): Promise<IUser[]>;
}
