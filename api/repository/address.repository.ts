import { Model } from "mongoose";
import { IAddress } from "../interfaces/IAddress";
import { AbstractRepository } from "./abstract.repository";
import { IUser } from "../interfaces/IUser";
import { IAddressRepository } from "../interfaces/IAddressRepository";
import { ErrorHandler } from "../middlewares/error.middleware";

export class AddressRepository
  extends AbstractRepository<IAddress>
  implements IAddressRepository
{
  constructor(addressModel: Model<IAddress>, private userModel: Model<IUser>) {
    super(addressModel);
  }

  public async createWithUserId(userId: string, newAddress: IAddress) {
    let result: IAddress | undefined;
    const session = await this.model.startSession();
    await session.withTransaction(async () => {
      const currentDefaultAddress = await this.model.findOne({
        userId,
        isDefault: true,
      });

      if (currentDefaultAddress) {
        if (newAddress.isDefault) {
          currentDefaultAddress.isDefault = false;
          await currentDefaultAddress.save();
        }
      } else {
        newAddress.isDefault = true;
      }

      result = await this.model
        .create([{ ...newAddress, userId }], {
          session: session,
        })
        .then((addresses) => addresses[0]);

      const userFound = await this.userModel
        .findByIdAndUpdate(userId, { $push: { addresses: result?.id } })
        .session(session);

      if (!userFound) {
        throw new ErrorHandler("User not Found", 404);
      }
    });

    await session.endSession();

    if (result) {
      return result;
    } else {
      throw new ErrorHandler("Cannot create a new Address");
    }
  }
}
