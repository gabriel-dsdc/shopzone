import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repository/user.repository";
import { userModel } from "../models/user.model";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import {
  registerSchema,
  loginSchema,
  editUserSchema,
} from "../middlewares/schemas/user.schema";

const router = Router();
const userRepository = new UserRepository(userModel);
const userService = new UserService(userRepository);
const userController = new UserController(userRepository, userService);

router.post(
  "/register",
  authMiddleware.checkConfig,
  new ValidationMiddleware(registerSchema).validate,
  userController.create
);
router.post(
  "/login",
  new ValidationMiddleware(loginSchema).validate,
  userController.login
);
router.get("/:id", authMiddleware.auth, userController.findById);
router.put(
  "/:id",
  authMiddleware.auth,
  new ValidationMiddleware(editUserSchema).validate,
  userController.update
);
router.delete("/:id", authMiddleware.auth, userController.delete);

export { router as userRouter };
