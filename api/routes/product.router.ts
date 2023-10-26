import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { ProductRepository } from "../repository/product.repository";
import { productModel } from "../models/product.model";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { editProductSchema } from "../middlewares/schemas/product.schema";
import { ImageMiddleware } from "../middlewares/image.middleware";

const router = Router();
const productRepository = new ProductRepository(productModel);
const productController = new ProductController(productRepository);

router.post(
  "/",
  authMiddleware.adminRoute,
  new ImageMiddleware().uploadImage,
  productController.create
);
router.get("/", productController.findAll);
router.get("/:id", productController.findById);
router.put(
  "/:id",
  authMiddleware.adminRoute,
  new ValidationMiddleware(editProductSchema).validate,
  productController.update
);
router.delete("/:id", authMiddleware.adminRoute, productController.delete);

export { router as productRouter };
