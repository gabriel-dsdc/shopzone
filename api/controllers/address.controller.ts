import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IAddressRepository } from "../interfaces/IAddressRepository";
import { IAddress } from "../interfaces/IAddress";

export class AddressController {
  constructor(protected repository: IAddressRepository) {}

  public create = async (req: Request, res: Response) => {
    const newAddress = await this.repository.createWithUserId(
      res.locals.userId as string,
      req.body as IAddress
    );
    res.status(StatusCodes.CREATED).json(newAddress);
  };

  public findAll = async (_req: Request, res: Response) => {
    const addressList = await this.repository.findAll(
      res.locals.userId as string
    );
    res.status(StatusCodes.OK).json(addressList);
  };

  public findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const addressFound = await this.repository.findById(id);
    res.status(StatusCodes.OK).json(addressFound);
  };

  public update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const addressUpdated = await this.repository.update(
      id,
      req.body as IAddress
    );
    res.status(StatusCodes.OK).json(addressUpdated);
  };

  public delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const addressFound = await this.repository.delete(id);
    res
      .status(StatusCodes.OK)
      .json({
        message: "Address deleted successfully!",
        deletedAddress: addressFound,
      });
  };
}
