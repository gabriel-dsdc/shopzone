import Joi from "joi";
import { IUser } from "../../interfaces/IUser";

const passwordPattern =
  /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d -/:-@[\]-`{-~]{8,40}$/;

export const loginSchema = Joi.object<IUser>({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(40).regex(passwordPattern).required(),
}).required();

export const editUserSchema = Joi.object<IUser & { confirmPassword: string }>({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  password: Joi.string().min(8).max(40).regex(passwordPattern),
  confirmPassword: Joi.string().valid(Joi.ref("password")),
})
  .required()
  .messages({
    "any.only": "The password confirmation does not match",
    "string.pattern.base": `Your password must meet the following criteria:
- Contains at least one letter, one digit, and one special character
- Have at least between 8 and 40 characters
- Accepts almost all special characters except the backslash (\\)`,
  });

export const registerSchema = Joi.object<IUser & { confirmPassword: string }>({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(40).regex(passwordPattern).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  role: Joi.string().valid("client").default("client"),
})
  .required()
  .messages({
    "any.only": "The password confirmation does not match",
    "string.pattern.base": `Your password must meet the following criteria:
- Contains at least one letter, one digit, and one special character
- Have at least between 8 and 40 characters
- Accepts almost all special characters except the backslash (\\)`,
  });
