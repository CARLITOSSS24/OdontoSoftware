import Joi from "joi";

const objectId = Joi.string()
  .length(24)
  .pattern(/^[a-fA-F0-9]{24}$/)
  .required()
  .messages({
    "any.required": "El campo es requerido.",
    "string.pattern.base": "Debe ser un ObjectId válido de 24 caracteres hexadecimales.",
    "string.length": "Debe tener exactamente 24 caracteres.",
  });

const rol = Joi.string()
  .min(3)
  .max(50)
  .required()
  .messages({
    "string.base": "El rol debe ser un texto.",
    "string.min": "El rol debe tener al menos 3 caracteres.",
    "string.max": "El rol no puede tener más de 50 caracteres.",
    "any.required": "El rol es un campo requerido.",
  });

const createPermisoSchema = Joi.object({
  rol: rol.required(),
});

const updatePermisoSchema = Joi.object({
  _id: objectId.optional(), 
  rol: rol.optional(),
});

const getPermisoSchema = Joi.object({
  _id: objectId, 
});

const deletePermisoSchema = Joi.object({
  _id: objectId, 
});

export {
  createPermisoSchema,
  updatePermisoSchema,
  getPermisoSchema,
  deletePermisoSchema,
};