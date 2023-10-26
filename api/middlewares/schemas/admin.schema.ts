import Joi from "joi";
import { editUserSchema, registerSchema } from "./user.schema";
import { IAdmin } from "../../interfaces/IAdmin";

export const createUserSchema = registerSchema.keys({
  role: Joi.string()
    .valid("client", "admin")
    .default("client")
    .messages({ "any.only": "{{#label}} must be one of {{#valids}}" }),
});

export const adminEditUserSchema = editUserSchema.keys({
  role: Joi.string()
    .valid("client", "admin")
    .messages({ "any.only": "{{#label}} must be one of {{#valids}}" }),
});

export const editConfigSchema = Joi.object<IAdmin>({
  allowNewUsers: Joi.boolean(),
  allowUserModifications: Joi.boolean(),
});
