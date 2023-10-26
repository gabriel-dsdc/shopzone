import { Schema } from "mongoose";
import { AbstractModel } from "./abstract.model";
import { IUser, Role } from "../interfaces/IUser";

class UserModel extends AbstractModel<IUser> {
  constructor() {
    const userSchema: Schema = new Schema<IUser>({
      name: { type: String, trim: true, required: true },
      email: {
        type: String,
        match: /^([\w-.]+)@([\w-]+)(\.[\w-]{2,})+$/,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
      },
      password: { type: String, select: false, required: true },
      role: { type: String, enum: Role, default: Role.Client },
      addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
      orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
      payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
      products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
      favorites: [{ type: Schema.Types.ObjectId, ref: "Product" }],
      reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
      stripeCustomerId: { type: String, required: true },
    });
    super("User", userSchema);
  }
}

export const userModel = new UserModel().model;
