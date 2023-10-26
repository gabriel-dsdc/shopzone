import Joi from "joi";
import { IOrder, Status } from "../../interfaces/IOrder";

export const orderSchema = Joi.object<IOrder>({
  status: Joi.string().valid(Status.Pending).default(Status.Pending),
  address: Joi.string().min(2).required(),
  payment: Joi.string().min(2),
  products: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().min(2).required(),
        quantity: Joi.number().min(1).default(1),
      }).required()
    )
    .required(),
}).required();

export const updateOrderSchema = Joi.object<IOrder>({
  status: Joi.string().valid(
    ...Object.values(Status).filter((status) => !Number.isFinite(status))
  ),
  address: Joi.string().min(2),
  payment: Joi.string().min(2),
  products: Joi.array().items(
    Joi.object({
      id: Joi.string().min(2).required(),
      quantity: Joi.number().min(1).default(1),
    }).required()
  ),
}).required();
