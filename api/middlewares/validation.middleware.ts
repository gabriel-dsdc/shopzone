import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ObjectSchema } from "joi";

export class ValidationMiddleware {
  constructor(private schema: ObjectSchema) {}

  public validate = (req: Request, res: Response, next: NextFunction) => {
    const { error } = this.schema.validate(req.body, { abortEarly: false });

    if (error) {
      return next({
        status: StatusCodes.BAD_REQUEST,
        message: error.details.map((detail) => detail.message),
      });
    }
    next();
  };
}
