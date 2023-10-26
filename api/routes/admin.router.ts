import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repository/user.repository";
import { userModel } from "../models/user.model";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import {
  createUserSchema,
  editConfigSchema,
} from "../middlewares/schemas/admin.schema";
import { AdminController } from "../controllers/admin.controller";
import { AdminRepository } from "../repository/admin.repository";

const router = Router();
const adminRepository = new AdminRepository();
const adminController = new AdminController(adminRepository);
const userRepository = new UserRepository(userModel);
const userService = new UserService(userRepository);
const userController = new UserController(userRepository, userService);

router.post(
  "/createUser",
  authMiddleware.adminRoute,
  new ValidationMiddleware(createUserSchema).validate,
  userController.create
);
router.get("/users", authMiddleware.adminRoute, adminController.findAll);
router.get(
  "/getConfigs",
  authMiddleware.adminRoute,
  adminController.getConfigs
);
router.put(
  "/updateConfigs",
  authMiddleware.adminRoute,
  new ValidationMiddleware(editConfigSchema).validate,
  adminController.update
);

export { router as adminRouter };
