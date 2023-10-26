import { Router, raw } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { PaymentRepository } from "../repository/payment.repository";
import { paymentModel } from "../models/payment.model";
import { authMiddleware } from "../middlewares/auth.middleware";
import { userModel } from "../models/user.model";

const router = Router();
const paymentRepository = new PaymentRepository(paymentModel, userModel);
const paymentController = new PaymentController(paymentRepository);

router.post("/pay/:orderId", authMiddleware.auth, paymentController.pay);
router.post(
  "/webhook",
  raw({ type: "application/json" }),
  paymentController.webhook
);
// router.get("/", authMiddleware.auth, paymentController.findAll);
// router.get("/:id", authMiddleware.auth, paymentController.findById);
// router.post(
//   "/",
//   authMiddleware.auth,
//   new ValidationMiddleware(paymentSchema).validate,
//   paymentController.create
// );
// router.put(
//   "/:id",
//   authMiddleware.auth,
//   new ValidationMiddleware(editPaymentSchema).validate,
//   paymentController.update
// );
// router.delete("/:id", authMiddleware.auth, paymentController.delete);

export { router as paymentRouter };
