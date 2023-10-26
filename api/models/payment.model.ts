import { Schema } from "mongoose";
import { AbstractModel } from "./abstract.model";
import { IPayment, PaymentMethod } from "../interfaces/IPayment";

class PaymentModel extends AbstractModel<IPayment> {
  constructor() {
    const isCreditCard = function (this: IPayment) {
      return this.paymentMethod === PaymentMethod.CreditCard;
    };
    const isBankTransfer = function (this: IPayment) {
      return this.paymentMethod === PaymentMethod.BankTransfer;
    };
    const isDigitalWallet = function (this: IPayment) {
      return this.paymentMethod === PaymentMethod.DigitalWallet;
    };

    const paymentSchema: Schema = new Schema({
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      isDefault: { type: Boolean, default: false },
      paymentMethod: {
        type: String,
        enum: PaymentMethod,
        required: true,
      },

      cardNumber: { type: String, select: false, required: isCreditCard },
      cardHolderName: { type: String, select: false, required: isCreditCard },
      expirationDate: { type: String, select: false, required: isCreditCard },
      securityCode: { type: String, select: false, required: isCreditCard },

      bankName: { type: String, required: isBankTransfer },
      accountNumber: { type: String, select: false, required: isBankTransfer },

      walletType: { type: String, required: isDigitalWallet },
      walletEmail: { type: String, select: false, required: isDigitalWallet },
    });
    paymentSchema.index({ userId: 1, isDefault: 1 }, { unique: true });
    super("Payment", paymentSchema);
  }
}

export const paymentModel = new PaymentModel().model;
