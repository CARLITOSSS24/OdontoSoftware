import Joi from "joi";
import mongoose from "mongoose";

const _id = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    "string.pattern.base": "El campo ID debe ser un ObjectId válido de 24 caracteres hexadecimales.",
    "any.required": "El campo ID es requerido.",
  });

const Nombres = Joi.string()
  .min(3)
  .max(50)
  .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
  .required()
  .messages({
    "string.base": "El nombre debe ser un texto.",
    "string.empty": "El nombre no puede estar vacío.",
    "string.min": "El nombre debe tener al menos 3 caracteres.",
    "string.max": "El nombre no puede exceder los 50 caracteres.",
    "string.pattern.base": "El nombre solo puede contener letras y espacios.",
    "any.required": "El nombre es un campo requerido.",
  });

const Apellidos = Joi.string()
  .min(3)
  .max(50)
  .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
  .required()
  .messages({
    "string.base": "El apellido debe ser un texto.",
    "string.empty": "El apellido no puede estar vacío.",
    "string.min": "El apellido debe tener al menos 3 caracteres.",
    "string.max": "El apellido no puede exceder los 50 caracteres.",
    "string.pattern.base": "El apellido solo puede contener letras y espacios.",
    "any.required": "El apellido es un campo requerido.",
  });

const Tipo_Doc = Joi.string()
  .valid("RC", "TI", "CC", "TE", "CE", "NIT", "PP", "PEP", "DIE", "PA")
  .required()
  .messages({
    "string.base": "El tipo de documento debe ser un texto.",
    "any.only": "El tipo de documento debe ser uno de los siguientes valores: RC, TI, CC, TE, CE, NIT, PP, PEP, DIE, PA.",
    "any.required": "El tipo de documento es un campo requerido.",
  });

const Doc_identificacion = Joi.string()
  .min(5)
  .max(20)
  .required()
  .messages({
    "string.base": "La identificación debe ser un texto.",
    "string.empty": "La identificación no puede estar vacía.",
    "string.min": "La identificación debe tener al menos 5 caracteres.",
    "string.max": "La identificación no puede exceder los 20 caracteres.",
    "any.required": "La identificación es un campo requerido.",
  });

const Telefono = Joi.number()
  .integer()
  .min(1000000000)
  .max(9999999999)
  .required()
  .messages({
    "number.base": "El teléfono debe ser un número.",
    "number.min": "El teléfono debe contener exactamente 10 dígitos.",
    "number.max": "El teléfono debe contener exactamente 10 dígitos.",
    "any.required": "El teléfono es un campo requerido.",
  });

const Correo = Joi.string()
  .email()
  .required()
  .messages({
    "string.base": "El correo debe ser un texto.",
    "string.email": "El correo debe tener un formato válido.",
    "any.required": "El correo es un campo requerido.",
  });

const Clave = Joi.string()
  .min(6)
  .max(32)
  .required()
  .messages({
    "string.base": "La clave debe ser un texto.",
    "string.min": "La clave debe tener al menos 6 caracteres.",
    "string.max": "La clave no puede exceder los 32 caracteres.",
    "any.required": "La clave es un campo requerido.",
  });

const Permiso = Joi.string()
  .length(24)
  .pattern(/^[a-fA-F0-9]{24}$/)
  .required()
  .messages({
    "string.base": "El campo Permiso debe ser un texto.",
    "string.length": "El campo Permiso debe tener exactamente 24 caracteres.",
    "string.pattern.base": "El campo Permiso debe ser un ObjectId válido.",
    "any.required": "El campo Permiso es requerido.",
  });

const Genero = Joi.string()
  .valid("Masculino", "Femenino", "Otro")
  .required()
  .messages({
    "string.base": "El género debe ser un texto.",
    "any.only": "El género debe ser Masculino, Femenino u Otro.",
    "any.required": "El género es un campo requerido.",
  });

const Edad = Joi.number()
  .integer()
  .min(0)
  .max(120)
  .required()
  .messages({
    "number.base": "La edad debe ser un número.",
    "number.integer": "La edad debe ser un número entero.",
    "number.min": "La edad no puede ser negativa.",
    "number.max": "La edad no puede ser mayor a 120.",
    "any.required": "La edad es un campo requerido.",
  });

const Id_consultorio = Joi.string()
  .length(24)
  .pattern(/^[a-fA-F0-9]{24}$/)
  .required()
  .messages({
    "string.base": "El campo Id_consultorio debe ser un texto.",
    "string.length": "El campo Id_consultorio debe tener exactamente 24 caracteres.",
    "string.pattern.base": "El campo Id_consultorio debe ser un ObjectId válido.",
    "any.required": "El campo Id_consultorio es requerido.",
  });

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId Validation');

const createDoctoraSchema = Joi.object({
  Nombres: Nombres.required(),
  Apellidos: Apellidos.required(),
  Tipo_Doc: Tipo_Doc.required(),
  Doc_identificacion: Doc_identificacion.required(),
  Telefono: Telefono.required(),
  Correo: Correo.required(),
  Clave: Clave.required(),
  Permiso: Permiso.required(),
  Genero: Genero.required(),
  Edad: Edad.required(),
  Id_consultorio: Id_consultorio.required(),
  cargo: objectId.required()
});

const updateDoctoraSchema = Joi.object({
  Nombres: Nombres.optional(),
  Apellidos: Apellidos.optional(),
  Tipo_Doc: Tipo_Doc.optional(),
  Doc_identificacion: Doc_identificacion.optional(),
  Telefono: Telefono.optional(),
  Correo: Correo.optional(),
  Clave: Clave.optional(),
  Permiso: Permiso.optional(),
  Genero: Genero.optional(),
  Edad: Edad.optional(),
  Id_consultorio: Id_consultorio.optional(),
  cargo: objectId
});

const buscarDoctoraIDSchema = Joi.object({
  _id: _id.required(),
});

const deleteDoctoraSchema = Joi.object({
  _id: _id.required(),
});

export {
  createDoctoraSchema,
  updateDoctoraSchema,
  buscarDoctoraIDSchema,
  deleteDoctoraSchema,
};
