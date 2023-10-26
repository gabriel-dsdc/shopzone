import Joi from "joi";
import { Category, IProduct } from "../../interfaces/IProduct";

const productObj = {
  name: Joi.string().min(2).required(),
  images: Joi.array()
    .items(
      Joi.string()
        .uri({ domain: {} })
        .regex(/\.(png|jpg|jpeg|gif|webp)$/)
        .min(2)
        .required()
    )
    .required(),
  description: Joi.string().min(2).required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().integer().min(0).default(1),
  category: Joi.string()
    .valid(...Object.values(Category))
    .default("Others")
    .messages({
      "any.only": `"category" must be one of ${Object.values(Category).reduce(
        (msg, category, index, arr) => {
          const isLast = index === arr.length - 1;
          return (msg += `[${category}]` + (isLast ? "" : ", "));
        },
        ""
      )}`,
    }),
  brand: Joi.string().min(2),
  authors: Joi.array().items(Joi.string().min(2)),
};

export const productSchema = Joi.object<IProduct>(productObj)
  .required()
  .messages({
    "string.pattern.base":
      "The image link must end with one of the following extensions: png|jpg|jpeg|gif|webp",
  });

export const editProductSchema = productSchema.fork(
  Object.keys(productObj),
  (schema) => schema.optional()
);
