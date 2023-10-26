import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { IOrder } from "../interfaces/IOrder";

export class OrderController {
  constructor(protected repository: IOrderRepository) {}

  public create = async (req: Request, res: Response) => {
    const newOrder = await this.repository.createWithUserId(
      res.locals.userId as string,
      req.body as IOrder
    );
    res.status(StatusCodes.CREATED).json(newOrder);
  };

  public findAll = async (req: Request, res: Response) => {
    const orderList = await this.repository.findAll(
      res.locals.userId as string
    );
    res.status(StatusCodes.OK).json(orderList);
  };
}
