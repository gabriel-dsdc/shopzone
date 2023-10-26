import { NextFunction, Request, Response } from "express";
import ImgurClient from "imgur";
import multer from "multer";
import { IProduct } from "../interfaces/IProduct";
import { ValidationMiddleware } from "./validation.middleware";
import { productSchema } from "./schemas/product.schema";
import Joi from "joi";

type IProductRequest = Request<
  NonNullable<unknown>,
  NonNullable<unknown>,
  IProduct
>;

export class ImageMiddleware {
  private client: ImgurClient;

  constructor(
    private upload = multer({
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter(req, file, cb) {
        if (file.mimetype.includes("image")) {
          return cb(null, true);
        }
        cb(null, false);
      },
    })
  ) {
    this.client = new ImgurClient({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    });
  }

  public uploadImage = [
    this.upload.array("images"),
    (req: IProductRequest, res: Response, next: NextFunction) => {
      new ValidationMiddleware(
        req.body.images
          ? productSchema
          : productSchema.keys({ images: Joi.optional() })
      ).validate(req, res, next);
    },
    async (
      req: Request<NonNullable<unknown>, NonNullable<unknown>, IProduct>,
      res: Response,
      next: NextFunction
    ) => {
      if (Array.isArray(req.files)) {
        req.body.images = req.body.images || [];
        await Promise.all(
          req.files.map(async (file) => {
            const response = await this.client.upload({
              image: file.buffer,
              album: process.env.ALBUM_HASH,
            });
            req.body.images.push(response.data.link);
          })
        );
      }
      next();
    },
    new ValidationMiddleware(productSchema).validate,
  ];
}
