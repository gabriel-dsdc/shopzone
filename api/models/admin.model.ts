import { Schema } from "mongoose";
import { AbstractModel } from "./abstract.model";
import { IAdmin } from "../interfaces/IAdmin";

class AdminModel extends AbstractModel<IAdmin> {
  constructor() {
    const adminSchema: Schema = new Schema<IAdmin>({
      allowNewUsers: { type: Boolean, default: true },
      allowUserModifications: { type: Boolean, default: true },
    });
    super("Admin", adminSchema);
  }
}

export const adminModel = new AdminModel().model;
