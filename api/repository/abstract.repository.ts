import { Model } from "mongoose";
import { IAbstractRepository } from "../interfaces/IAbstractRepository";
import { ErrorHandler } from "../middlewares/error.middleware";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export abstract class AbstractRepository<T extends { id: string }>
  implements IAbstractRepository<T>
{
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async findAll(id: string): Promise<T[]> {
    return this.model.find({ userId: id });
  }

  public async findById(id: string | number): Promise<T> {
    const docFound = await this.model.findById(id);
    if (!docFound)
      throw new ErrorHandler(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND);
    return docFound;
  }

  public async update(
    id: string | number,
    newData: Partial<T>
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, newData, { returnOriginal: false });
  }

  public async delete(id: string | number): Promise<T | null> {
    const docFound = await this.model.findByIdAndDelete(id);
    if (!docFound) {
      throw new ErrorHandler(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return docFound;
  }
}
