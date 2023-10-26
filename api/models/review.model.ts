import { Schema } from "mongoose";
import { AbstractModel } from "./abstract.model";
import { IReview } from "../interfaces/IReview";

class ReviewModel extends AbstractModel<IReview> {
  constructor() {
    const reviewSchema: Schema = new Schema({
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      title: { type: String, trim: true, required: true },
      description: { type: String, required: true },
      rating: { type: Number, max: 10, default: 0 },
    });
    super("Review", reviewSchema);
  }
}

export const reviewModel = new ReviewModel().model;
