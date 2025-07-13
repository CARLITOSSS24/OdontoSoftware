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

  const Nombre = Joi.string()
    .min(3)
    .max(90)
    .required()
    .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.base": "El nombre debe ser un texto.",
      "string.empty": "El nombre no puede estar vacío.",
      "string.min": "El nombre debe tener al menos 3 caracteres.",
      "string.max": "El nombre no puede exceder los 90 caracteres.",
      "string.pattern.base": "El nombre solo puede contener letras y espacios.",
      "any.required": "El nombre es un campo requerido.",
    });

  const Descripcion= Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      "string.base": "La descripción debe ser un texto.",
      "string.empty": "La descripción no puede estar vacía.",
      "string.min": "La descripción debe tener al menos 10 caracteres.",
      "string.max": "La descripción no puede exceder los 200 caracteres.",
      "any.required": "La descripción es un campo requerido.",
    });

  const Disponible= Joi.string()
    .valid("Activo", "Inactivo")
    .required()
    .messages({
      "string.base": "El estado de disponibilidad debe ser un texto.",
      "any.only": "El estado de disponibilidad solo puede ser 'Activo' o 'Inactivo'.",
      "any.required": "El estado de disponibilidad es un campo requerido.",
    });

  const Precio=Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "El precio debe ser un número.",
      "number.positive": "El precio debe ser un número positivo.",
      "any.required": "El precio es un campo requerido.",
    });




const createServicioSchema = Joi.object({
  Nombre: Nombre.required(),
  Descripcion: Descripcion.required(),
  Disponible: Disponible.required(),
  Precio: Precio.required()
});

const updateServicioSchema = Joi.object({
  Nombre: Nombre.required(),
  Descripcion: Descripcion.required(),
  Disponible: Disponible.required(),
  Precio: Precio.required(),
});

const getServicioIdSchema = Joi.object({
  _id: _id.required(),
});

const deleteServicioSchema = Joi.object({
  _id: _id.required(),
});

export {
    createServicioSchema,
    getServicioIdSchema,
    updateServicioSchema,
    deleteServicioSchema
};
