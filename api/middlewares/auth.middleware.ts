import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AdminRepository } from "../repository/admin.repository";

const adminRepository = new AdminRepository();

class AuthMiddleware {
  private jwtSecretKey: string | undefined;

  constructor() {
    this.jwtSecretKey = process.env.JWT_SECRET;
  }

  private verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Missing Token" });
    }

    if (!this.jwtSecretKey) {
      return next({ message: "Please add your JWT_SECRET to .env" });
    }

    jwt.verify(token, this.jwtSecretKey, (err, payload) => {
      if (err) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: "Invalid Token" });
      }
      res.locals = {
        userId: (payload as JwtPayload)?.id as string,
        userRole: (payload as JwtPayload)?.role as string,
        stripeCustomerId: (payload as JwtPayload)?.stripeCustomerId as string,
      };
    });
    next();
  };

  public checkConfig = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (res.locals.userRole === "admin") return next();

    const { allowNewUsers, allowUserModifications } =
      await adminRepository.getConfigs();

    if (!allowNewUsers && req.path === "/register") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "New users are not allowed by the administration!" });
    }

    if (
      !allowUserModifications &&
      (req.method === "POST" || req.method === "PUT") &&
      req.path !== "/register"
    ) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Modifications are not authorized by the administration!",
      });
    }
    next();
  };

  public auth = [
    this.verifyToken,
    this.checkConfig,
    async (req: Request, res: Response, next: NextFunction) => {
      const { id: paramId } = req.params;

      const userId = await adminRepository.getUserIdByModel(
        paramId,
        req.baseUrl
      );

      if (
        paramId &&
        res.locals.userId !== paramId &&
        res.locals.userId !== userId &&
        res.locals.userRole !== "admin"
      ) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message:
            "You are not authorized to edit this resource because you do not own it.",
        });
      }
      next();
    },
  ];

  public adminRoute = [
    this.verifyToken,
    (req: Request, res: Response, next: NextFunction) => {
      if (res.locals.userRole !== "admin") {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "You need administrative privileges to do this!" });
      }
      next();
    },
  ];
}

export const authMiddleware = new AuthMiddleware();
