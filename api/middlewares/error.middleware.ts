import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class ErrorHandler extends Error {
  public status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }

  public static handle(
    error: ErrorHandler,
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (res.headersSent) {
      return next(error);
    }
    res
      .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
}
