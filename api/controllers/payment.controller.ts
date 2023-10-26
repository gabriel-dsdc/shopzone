import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IPaymentRepository } from "../interfaces/IPaymentRepository";
// import { IPayment } from "../interfaces/IPayment";

export class PaymentController {
  constructor(protected repository: IPaymentRepository) {}

  public pay = async (req: Request, res: Response) => {
    const { stripeCustomerId } = res.locals;
    const { orderId } = req.params;
    const url = await this.repository.pay(orderId, stripeCustomerId as string);
    res.status(StatusCodes.OK).json({ url });
  };

  public webhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];

    if (sig) {
      await this.repository.webhook(req.body as string, sig as string);
    }

    res.status(200).end();
  };

  // public create = async (req: Request, res: Response) => {
  //   const newPayment = await this.repository.createWithUserId(
  //     res.locals.userId as string,
  //     req.body as IPayment
  //   );
  //   res
  //     .status(StatusCodes.CREATED)
  //     .json({ message: "Payment created successfully!", newPayment });
  // };

  // public findAll = async (_req: Request, res: Response) => {
  //   const paymentsList = await this.repository.findAll(
  //     res.locals.userId as string
  //   );
  //   res.status(StatusCodes.OK).json(paymentsList);
  // };

  // public findById = async (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   const paymentFound = await this.repository.findById(id);
  //   res.status(StatusCodes.OK).json(paymentFound);
  // };

  // public update = async (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   const paymentUpdated = await this.repository.update(
  //     id,
  //     req.body as IPayment
  //   );
  //   res.status(StatusCodes.OK).json(paymentUpdated);
  // };

  // public delete = async (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   const paymentFound = await this.repository.delete(id);
  //   res.status(StatusCodes.OK).json({
  //     message: "Payment deleted successfully!",
  //     deletedPayment: paymentFound,
  //   });
  // };
}
