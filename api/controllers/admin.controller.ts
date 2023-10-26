import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { IAdmin } from "../interfaces/IAdmin";

export class AdminController {
  constructor(protected repository: IAdminRepository) {}

  public getConfigs = async (_req: Request, res: Response) => {
    const configs = await this.repository.getConfigs();
    res.status(StatusCodes.OK).json(configs);
  };

  public update = async (req: Request, res: Response) => {
    const configUpdated = await this.repository.updateConfigs(
      req.body as IAdmin
    );
    res.status(StatusCodes.OK).json(configUpdated);
  };

  public findAll = async (req: Request, res: Response) => {
    const usersList = await this.repository.findAll(req.query as never);
    res.status(StatusCodes.OK).json(usersList);
  };
}
