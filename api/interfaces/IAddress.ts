import { IUser } from "./IUser";

export interface IAddress {
  id: string;
  userId: IUser["id"];
  isDefault: boolean;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}
