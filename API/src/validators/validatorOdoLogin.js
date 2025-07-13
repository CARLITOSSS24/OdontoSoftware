import Joi from "joi";
import { body } from 'express-validator';

const loginSchema = Joi.object({
  Correo: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": "El correo debe ser un texto.",
      "string.email": "El correo debe tener un formato válido.",
      "any.required": "El correo es un campo requerido.",
    }),
  
  Clave: Joi.string()
    .alphanum()
    .min(8)
    .max(16)
    .required()
    .messages({
      "string.base": "La clave debe ser un texto.",
      "string.alphanum": "La clave debe contener solo letras y números.",
      "string.min": "La clave debe tener al menos 8 caracteres.",
      "string.max": "La clave no puede exceder los 16 caracteres.",
      "any.required": "La clave es un campo requerido.",
    })
});

export { loginSchema };
