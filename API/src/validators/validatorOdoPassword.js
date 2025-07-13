import Joi from "joi";

const resetPasswordRequestSchema = Joi.object({
  correo: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": "El correo debe ser un texto.",
      "string.email": "El correo debe tener un formato válido.",
      "any.required": "El correo es un campo requerido.",
    }),
  documento: Joi.string()
    .min(5)
    .max(20)
    .required()
    .messages({
      "string.base": "El documento debe ser un texto.",
      "string.min": "El documento debe tener al menos 5 caracteres.",
      "string.max": "El documento no puede exceder los 20 caracteres.",
      "any.required": "El documento es un campo requerido.",
    }),
});

const resetPasswordSchema = Joi.object({
  correo: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": "El correo debe ser un texto.",
      "string.email": "El correo debe tener un formato válido.",
      "any.required": "El correo es un campo requerido.",
    }),
  codigo: Joi.string()
    .length(5)
    .required()
    .messages({
      "string.base": "El código debe ser un texto.",
      "string.length": "El código debe tener exactamente 5 caracteres.",
      "any.required": "El código es un campo requerido.",
    }),
  nuevaClave: Joi.string()
    .min(8)
    .max(32)
    .required()
    .messages({
      "string.base": "La contraseña debe ser un texto.",
      "string.min": "La contraseña debe tener al menos 8 caracteres.",
      "string.max": "La contraseña no puede exceder los 32 caracteres.",
      "any.required": "La contraseña es un campo requerido.",
    }),
});

export { resetPasswordRequestSchema, resetPasswordSchema }; 