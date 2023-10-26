import { Model } from "mongoose";
import { IPayment } from "../interfaces/IPayment";
import { IUser } from "../interfaces/IUser";
import { AbstractRepository } from "./abstract.repository";
import { IPaymentRepository } from "../interfaces/IPaymentRepository";
import { stripe } from "../app";
import { orderModel } from "../models/order.model";
import { productModel } from "../models/product.model";
import { Status } from "../interfaces/IOrder";
import Stripe from "stripe";
// import { ErrorHandler } from "../middlewares/error.middleware";
// import bcrypt from "bcrypt";
// import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class PaymentRepository
  extends AbstractRepository<IPayment>
  implements IPaymentRepository
{
  constructor(paymentModel: Model<IPayment>, private userModel: Model<IUser>) {
    super(paymentModel);
  }

  public async pay(orderId: string, customerId: string) {
    const order = await orderModel.findById(orderId);
    if (order) {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: order.products.map((orderProduct) => ({
          price: orderProduct.stripePriceId,
          quantity: orderProduct.quantity,
        })),
        mode: "payment",
        payment_intent_data: { setup_future_usage: "on_session" },
        success_url: `${process.env.APP_URL}/success`,
        cancel_url: `${process.env.APP_URL}/cancel`,
        metadata: { orderId: order.id as string },
      });
      if (session.url) {
        return session.url;
      }
    }
    throw new Error("Session URL is missing");
  }

  private updateOrder = async (session: Stripe.Checkout.Session) => {
    const { line_items, metadata } = await stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: ["line_items"],
      }
    );
    const order = await orderModel.findById(metadata!.orderId);
    if (line_items && order) {
      for (const orderProduct of line_items.data) {
        await productModel.findOneAndUpdate(
          { stripePriceId: orderProduct.price!.id },
          { $inc: { quantity: -orderProduct.quantity! } }
        );
      }
      order.status = Status.Shipped;
      await order.save();
    }
  };

  public async webhook(payload: string | Buffer, sig: string) {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.endpointSecret!
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        if (session.payment_status === "paid") {
          await this.updateOrder(session);
        }

        break;
      }
    }
  }

  // public async createWithUserId(userId: string, newPayment: IPayment) {
  //   let result: IPayment | undefined;
  //   const session = await this.model.startSession();
  //   await session.withTransaction(async () => {
  //     const currentDefaultPayment = await this.model.findOne({
  //       userId,
  //       isDefault: true,
  //     });

  //     if (currentDefaultPayment) {
  //       if (newPayment.isDefault) {
  //         currentDefaultPayment.isDefault = false;
  //         await currentDefaultPayment.save();
  //       }
  //     } else {
  //       newPayment.isDefault = true;
  //     }

  //     for (const key in newPayment) {
  //       if (key !== "paymentMethod" && key !== "isDefault") {
  //         newPayment[key] = await bcrypt.hash(newPayment[key].toString(), 10);
  //       }
  //     }

  //     result = await this.model
  //       .create([{ ...newPayment, userId }], { session: session })
  //       .then((payments) => payments[0]);

  //     const userFound = await this.userModel
  //       .findByIdAndUpdate(userId, { $push: { payments: result?.id } })
  //       .session(session);

  //     if (!userFound) {
  //       throw new ErrorHandler("User not Found", 404);
  //     }
  //   });

  //   await session.endSession();

  //   if (result) {
  //     return { id: result.id, paymentMethod: result.paymentMethod };
  //   } else {
  //     throw new ErrorHandler("Cannot create a new Payment");
  //   }
  // }

  // public async findAll() {
  //   const paymentsFound = await this.model.find({}, [
  //     "id",
  //     "isDefault",
  //     "paymentMethod",
  //     "cardNumber",
  //   ]);
  //   return paymentsFound;
  // }

  // public async findById(id: string) {
  //   const paymentFound = await this.model.findById(id, [
  //     "id",
  //     "isDefault",
  //     "paymentMethod",
  //   ]);
  //   if (!paymentFound)
  //     throw new ErrorHandler(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND);
  //   return paymentFound;
  // }

  // public async update(id: string | number, updatedPayment: IPayment) {
  //   return this.model.findByIdAndUpdate(id, updatedPayment, {
  //     returnOriginal: false,
  //     fields: ["id", "isDefault", "paymentMethod"],
  //   });
  // }
}
