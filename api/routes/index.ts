import { Router } from "express";
import { userRouter } from "./user.router";
import { adminRouter } from "./admin.router";
import { productRouter } from "./product.router";
import { addressRouter } from "./address.router";
import { paymentRouter } from "./payment.router";
import { orderRouter } from "./order.router";

const router = Router();

router.get("/", (req, res) =>
  res.json(JSON.stringify({ message: "Hello world!" }))
);
router.use("/users", userRouter);
router.use("/admin", adminRouter);
router.use("/products", productRouter);
router.use("/addresses", addressRouter);
router.use("/orders", orderRouter);
router.use("/payments", paymentRouter);
// router.use("/reviews", );

export { router as indexRouter };
