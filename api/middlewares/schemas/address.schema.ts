import Joi from "joi";
import { IAddress } from "../../interfaces/IAddress";

export const addressSchema = Joi.object<IAddress>({
  isDefault: Joi.boolean(),
  street: Joi.string().min(2).required(),
  city: Joi.string().min(2).required(),
  state: Joi.string().min(2).required(),
  postalCode: Joi.string().min(2).required(),
}).required();

export const editAddressSchema = Joi.object<IAddress>({
  isDefault: Joi.boolean(),
  street: Joi.string().min(2),
  city: Joi.string().min(2),
  state: Joi.string().min(2),
  postalCode: Joi.string().min(2),
});
