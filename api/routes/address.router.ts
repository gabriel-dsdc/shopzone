import { Router } from "express";
import { AddressController } from "../controllers/address.controller";
import { AddressRepository } from "../repository/address.repository";
import { addressModel } from "../models/address.model";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import {
  addressSchema,
  editAddressSchema,
} from "../middlewares/schemas/address.schema";
import { userModel } from "../models/user.model";

const router = Router();
const addressRepository = new AddressRepository(addressModel, userModel);
const addressController = new AddressController(addressRepository);

router.get("/", authMiddleware.auth, addressController.findAll);
router.post(
  "/",
  authMiddleware.auth,
  new ValidationMiddleware(addressSchema).validate,
  addressController.create
);
router.put(
  "/:id",
  authMiddleware.auth,
  new ValidationMiddleware(editAddressSchema).validate,
  addressController.update
);
router.delete("/:id", authMiddleware.auth, addressController.delete);

export { router as addressRouter };
