import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { OrderRepository } from "../repository/order.repository";
import { orderModel } from "../models/order.model";
import { userModel } from "../models/user.model";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { orderSchema } from "../middlewares/schemas/order.schema";

const router = Router();
const orderRepository = new OrderRepository(orderModel, userModel);
const orderController = new OrderController(orderRepository);

router.post(
  "/",
  authMiddleware.auth,
  new ValidationMiddleware(orderSchema).validate,
  orderController.create
);
router.get("/", authMiddleware.auth, orderController.findAll);

export { router as orderRouter };
