import { Model } from "mongoose";
import { IUser } from "../interfaces/IUser";
import { AbstractRepository } from "./abstract.repository";
import { IUserRepository } from "../interfaces/IUserRepository";
import { stripe } from "../app";

export class UserRepository
  extends AbstractRepository<IUser>
  implements IUserRepository
{
  constructor(userModel: Model<IUser>) {
    super(userModel);
  }

  public async login({ email }: IUser): Promise<IUser | null> {
    return this.model.findOne({ email }, "+password");
  }

  public async create(newUser: IUser): Promise<IUser> {
    const { id } = await stripe.customers.create({
      name: newUser.name,
      email: newUser.email,
    });
    return this.model.create({ ...newUser, stripeCustomerId: id });
  }
}
