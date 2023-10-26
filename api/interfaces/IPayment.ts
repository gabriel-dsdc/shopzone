import { IUser } from "./IUser";

export enum PaymentMethod {
  CreditCard = "creditCard",
  BankTransfer = "bankTransfer",
  DigitalWallet = "digitalWallet",
}

export interface IPayment {
  [key: string]: string | boolean;
  id: string;
  userId: IUser["id"];
  paymentMethod: PaymentMethod;
  isDefault: boolean;

  cardNumber: string;
  cardHolderName: string;
  expirationDate: string;
  securityCode: string;

  bankName: string;
  accountNumber: string;

  walletType: string;
  walletEmail: string;
}
