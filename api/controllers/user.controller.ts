import { Request, Response } from "express";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserService } from "../services/user.service";
import { StatusCodes } from "http-status-codes";
import { IUser } from "../interfaces/IUser";

export class UserController {
  constructor(
    private repository: IUserRepository,
    private service: IUserService
  ) {}

  public create = async (
    req: Request<NonNullable<unknown>, NonNullable<unknown>, IUser>,
    res: Response
  ) => {
    const hash = await this.service.hashPassword(req.body.password);
    const newUser = await this.repository.create({
      ...req.body,
      password: hash,
    });
    const token = this.service.generateToken(newUser);
    res.status(StatusCodes.CREATED).json({ token });
  };

  public login = async (
    req: Request<NonNullable<unknown>, NonNullable<unknown>, IUser>,
    res: Response
  ) => {
    const token = await this.service.login(req.body);
    res.status(StatusCodes.OK).json({ token });
  };

  public findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userFound = await this.repository.findById(id);
    res.status(StatusCodes.OK).json(userFound);
  };

  public update = async (
    req: Request<{ [key: string]: string }, NonNullable<unknown>, IUser>,
    res: Response
  ) => {
    const { id } = req.params;
    if (req.body.password) {
      req.body.password = await this.service.hashPassword(req.body.password);
    }
    const userUpdated = await this.repository.update(id, req.body);
    res.status(StatusCodes.OK).json(userUpdated);
  };

  public delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userFound = await this.repository.delete(id);
    res
      .status(StatusCodes.OK)
      .json({ message: "User deleted successfully!", deletedUser: userFound });
  };
}
