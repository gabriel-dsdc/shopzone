import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IProductRepository } from "../interfaces/IProductRepository";
import { IProduct } from "../interfaces/IProduct";

export class ProductController {
  constructor(protected repository: IProductRepository) {}

  public create = async (req: Request, res: Response) => {
    const newProduct = await this.repository.create(
      res.locals.userId as string,
      req.body as IProduct
    );
    res.status(StatusCodes.CREATED).json(newProduct);
  };

  public findAll = async (_req: Request, res: Response) => {
    const productsList = await this.repository.findAll();
    res.status(StatusCodes.OK).json(productsList);
  };

  public findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productFound = await this.repository.findById(id);
    res.status(StatusCodes.OK).json(productFound);
  };

  public update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productUpdated = await this.repository.update(
      id,
      req.body as IProduct
    );
    res.status(StatusCodes.OK).json(productUpdated);
  };

  public delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productFound = await this.repository.delete(id);
    res.status(StatusCodes.OK).json({
      message: "Product deleted successfully!",
      deletedProduct: productFound,
    });
  };
}
