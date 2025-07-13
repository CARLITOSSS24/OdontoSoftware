import Joi from "joi";

const _id = Joi.string()
  .length(24) 
  .pattern(/^[a-fA-F0-9]{24}$/) 
  .required() 
  .messages({
    "any.required": "El campo _id es requerido",
    "string.pattern.base": "El campo _id debe ser un ObjectId válido", 
    "string.length": "El campo _id debe tener exactamente 24 caracteres",
  });

const Nombre_consultorio = Joi.string()
  .pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-\.\,]+$/) 
  .min(1)      
  .max(100)     
  .required()  
  .messages({
    "any.required": "El campo Nombre_consultorio es requerido.",
    "string.pattern.base": "El campo Nombre_consultorio solo puede contener letras, números, espacios, guiones, puntos y comas.",
    "string.min": "El campo Nombre_consultorio debe tener al menos 1 carácter.",
    "string.max": "El campo Nombre_consultorio no puede exceder los 100 caracteres.",
  });
  
const createConsultorioSchema = Joi.object({
  Nombre_consultorio: Nombre_consultorio.required(),
});

const updateConsultorioSchema = Joi.object({
  Nombre_consultorio: Nombre_consultorio.required(),
});

const getConsultorioSchema = Joi.object({
  _id: _id.required(),
});

const deleteConsultorioSchema = Joi.object({
  _id: _id.required(),
});

export { 
  createConsultorioSchema,
  getConsultorioSchema,
  updateConsultorioSchema,
  deleteConsultorioSchema
};
