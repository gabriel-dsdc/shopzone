import { Schema } from "mongoose";
import { AbstractModel } from "./abstract.model";
import { IAddress } from "../interfaces/IAddress";

class AddressModel extends AbstractModel<IAddress> {
  constructor() {
    const addressSchema: Schema = new Schema({
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      isDefault: { type: Boolean, default: false },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
    });
    super("Address", addressSchema);
  }
}

export const addressModel = new AddressModel().model;
