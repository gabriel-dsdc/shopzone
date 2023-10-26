import Joi from "joi";
import { IPayment, PaymentMethod } from "../../interfaces/IPayment";

const paymentObj = {
  isDefault: Joi.boolean(),
  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethod))
    .required()
    .messages({
      "any.only": `"paymentMethod" must be one of ${Object.values(
        PaymentMethod
      ).reduce((msg, paymentMethod, index, arr) => {
        const isLast = index === arr.length - 1;
        return (msg += `[${paymentMethod}]` + (isLast ? "" : ", "));
      }, "")}`,
    }),

  cardNumber: Joi.when("paymentMethod", {
    is: PaymentMethod.CreditCard,
    then: Joi.string().min(2).required(),
  }),
  cardHolderName: Joi.when("paymentMethod", {
    is: PaymentMethod.CreditCard,
    then: Joi.string().min(2).required(),
  }),
  expirationDate: Joi.when("paymentMethod", {
    is: PaymentMethod.CreditCard,
    then: Joi.date().min(2).required(),
  }),
  securityCode: Joi.when("paymentMethod", {
    is: PaymentMethod.CreditCard,
    then: Joi.string().min(2).required(),
  }),

  bankName: Joi.when("paymentMethod", {
    is: PaymentMethod.BankTransfer,
    then: Joi.string().min(2).required(),
  }),
  accountNumber: Joi.when("paymentMethod", {
    is: PaymentMethod.BankTransfer,
    then: Joi.string().min(2).required(),
  }),

  walletType: Joi.when("paymentMethod", {
    is: PaymentMethod.DigitalWallet,
    then: Joi.string().min(2).required(),
  }),
  walletEmail: Joi.when("paymentMethod", {
    is: PaymentMethod.DigitalWallet,
    then: Joi.string().min(2).required(),
  }),
};

export const paymentSchema = Joi.object<IPayment>(paymentObj).required();

export const editPaymentSchema = paymentSchema.fork(
  Object.keys(paymentObj),
  (schema) => schema.optional()
);

// export const paymentProductsSchema = Joi.object({
//   orderId: Joi.string().required(),
//   products: Joi.array()
//     .items(
//       Joi.object({
//         stripePriceId: Joi.string().required(),
//         quantity: Joi.number().required(),
//       }).required()
//     )
//     .required(),
// }).required();
