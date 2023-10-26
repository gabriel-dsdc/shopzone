import { Model } from "mongoose";
import { IAdmin } from "../interfaces/IAdmin";
import { adminModel } from "../models/admin.model";
import { userModel } from "../models/user.model";
import { addressModel } from "../models/address.model";
import { productModel } from "../models/product.model";
import { orderModel } from "../models/order.model";
import { paymentModel } from "../models/payment.model";
import { reviewModel } from "../models/review.model";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { IUser } from "../interfaces/IUser";

export class AdminRepository implements IAdminRepository {
  private configModel: Model<IAdmin> = adminModel;
  private userModel: Model<IUser> = userModel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private models: { [key: string]: Model<any> } = {
    addresses: addressModel,
    orders: orderModel,
    payments: paymentModel,
    products: productModel,
    reviews: reviewModel,
  };

  public updateConfigs = async (newConfigs: IAdmin = {}): Promise<IAdmin> => {
    return this.configModel.findOneAndUpdate({}, newConfigs, {
      upsert: true,
      returnOriginal: false,
    });
  };

  public async getConfigs(): Promise<IAdmin> {
    const hasConfig = await this.configModel.findOne();
    if (hasConfig) {
      return hasConfig;
    }
    return await this.configModel.create({});
  }

  public async getUserIdByModel(
    id: string,
    baseUrl: string
  ): Promise<string | undefined> {
    baseUrl = baseUrl.slice(1);

    if (!this.models[baseUrl]) {
      return;
    }

    const hasFound: { userId: string } | null = await this.models[
      baseUrl
    ].findById(id, "userId");

    if (hasFound) {
      return hasFound.userId.toString();
    }
  }

  public async findAll(queries: IUser): Promise<IUser[]> {
    if (Object.keys(queries).length) {
      const lookups = [];
      for (const query in queries) {
        if (
          ["addresses", "orders", "payments", "favorites", "reviews"].includes(
            query
          )
        ) {
          lookups.push({
            $lookup: {
              from: query,
              foreignField: "_id",
              localField: query,
              as: query,
            },
          });
        }
      }
      return this.userModel.aggregate(lookups);
    }
    return this.userModel.find();
  }
}
