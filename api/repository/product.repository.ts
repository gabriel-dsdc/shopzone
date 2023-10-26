import { Model } from "mongoose";
import { IProduct } from "../interfaces/IProduct";
import { IProductRepository } from "../interfaces/IProductRepository";
import { AbstractRepository } from "./abstract.repository";
import { stripe } from "../app";

export class ProductRepository
  extends AbstractRepository<IProduct>
  implements IProductRepository
{
  constructor(productModel: Model<IProduct>) {
    super(productModel);
  }

  public async create(userId: string, newProduct: IProduct): Promise<IProduct> {
    const { default_price } = await stripe.products.create({
      name: newProduct.name,
      images: newProduct.images,
      description: newProduct.description,
      default_price_data: {
        currency: "usd",
        unit_amount_decimal: newProduct.price.toString(),
      },
      metadata: {
        category: newProduct.category,
        brand: newProduct.brand,
        authors: newProduct.authors.join("|"),
        reviews: newProduct.reviews.join("|"),
      },
    });
    return this.model.create({
      ...newProduct,
      userId,
      stripePriceId: default_price,
    });
  }

  public async findAll() {
    return this.model.find();
  }
}
