import { Schema } from "mongoose";
import { AbstractModel } from "./abstract.model";
import { IProduct } from "../interfaces/IProduct";

class ProductModel extends AbstractModel<IProduct> {
  constructor() {
    const productSchema: Schema = new Schema({
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, minlength: 2, trim: true, required: true },
      images: [{ type: String, minlength: 2, required: true }],
      description: { type: String, minlength: 2, required: true },
      price: { type: Number, min: 0, required: true },
      quantity: { type: Number, min: 0, default: 1 },
      category: { type: String, minlength: 2, default: "Others" },
      brand: { type: String, minlength: 2, trim: true },
      authors: [{ type: String, minlength: 2, trim: true }],
      reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
      stripePriceId: { type: String, required: true },
    });
    super("Product", productSchema);
  }
}

export const productModel = new ProductModel().model;
