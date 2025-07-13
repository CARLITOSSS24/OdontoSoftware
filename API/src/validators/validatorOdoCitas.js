import Joi from "joi";
import moment from "moment";

// Validación para el campo _id
const _id = Joi.string()
  .length(24)
  .pattern(/^[a-fA-F0-9]{24}$/)
  .required()
  .messages({
    "any.required": "El campo _id es requerido",
    "string.pattern.base": "El campo _id debe ser un ObjectId válido",
    "string.length": "El campo _id debe tener exactamente 24 caracteres",
  });

// Validación para el documento del cliente
const documentoCliente = Joi.string()
  .pattern(/^[0-9]+$/)
  .min(8)
  .max(15)
  .required()
  .messages({
    "any.required": "El campo documentoCliente es requerido.",
    "string.pattern.base": "El campo documentoCliente solo puede contener números.",
    "string.min": "El campo documentoCliente debe tener al menos 8 caracteres.",
    "string.max": "El campo documentoCliente no puede exceder los 15 caracteres.",
  });

// Validación para el nombre y apellido del cliente
const nombreCliente = Joi.string()
  .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
  .min(1)
  .max(50)
  .required()
  .messages({
    "any.required": "El campo nombreCliente es requerido.",
    "string.pattern.base": "El campo nombreCliente solo puede contener letras y espacios.",
    "string.min": "El campo nombreCliente debe tener al menos 1 carácter.",
    "string.max": "El campo nombreCliente no puede exceder los 50 caracteres.",
  });

const apellidoCliente = Joi.string()
  .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
  .min(1)
  .max(50)
  .required()
  .messages({
    "any.required": "El campo apellidoCliente es requerido.",
    "string.pattern.base": "El campo apellidoCliente solo puede contener letras y espacios.",
    "string.min": "El campo apellidoCliente debe tener al menos 1 carácter.",
    "string.max": "El campo apellidoCliente no puede exceder los 50 caracteres.",
  });

// Validación para el servicio, doctora y consultorio (referencias)
const servicio = _id.messages({
  "any.required": "El campo servicio es requerido.",
});
const doctora = _id.messages({
  "any.required": "El campo doctora es requerido.",
});
const consultorio = _id.messages({
  "any.required": "El campo consultorio es requerido.",
});

// Validación para la fecha y hora
const fecha = Joi.date()
  .required()
  .custom((value, helpers) => {
    const dayOfWeek = moment(value).day();
    const hora = helpers.state.ancestors[0].hora;
    const servicio = helpers.state.ancestors[0].servicio || helpers.state.ancestors[0].servicios;
    const doctoraCargo = helpers.state.ancestors[0].doctoraCargo || '';
    // Si el servicio es ortodoncia
    if (servicio && (servicio === 'ortodoncia' || servicio.Nombre === 'Ortodoncia')) {
      if (dayOfWeek !== 4) {
        return helpers.message('Las citas para ortodoncia solo están disponibles los jueves.');
      }
      // Horario permitido: 13:00 a 19:00, intervalos de 20 minutos
      const minutosValidos = ['00', '20', '40'];
      const [horaStr, minStr] = hora.split(':');
      const horaNum = parseInt(horaStr, 10);
      if (horaNum < 13 || horaNum > 19 || (horaNum === 19 && minStr !== '00')) {
        return helpers.message('El horario para ortodoncia es de 1 PM a 7 PM.');
      }
      if (!minutosValidos.includes(minStr)) {
        return helpers.message('Las citas de ortodoncia deben ser en intervalos de 20 minutos (00, 20, 40).');
      }
    } else {
      // Odontóloga general no puede atender ortodoncia
      if (servicio && (servicio === 'ortodoncia' || servicio.Nombre === 'Ortodoncia')) {
        return helpers.message('La odontóloga general no puede atender ortodoncia.');
      }
      // Restricción para otros servicios
      const [horaStr, minStr] = hora.split(':');
      const horaNum = parseInt(horaStr, 10);
      if (dayOfWeek === 0) {
        return helpers.message('No se atienden citas los domingos.');
      }
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        if (horaNum < 12 || horaNum > 17 || (horaNum === 17 && minStr !== '00')) {
          return helpers.message('Horario de odontología general: lun-vie 12:00 a 17:00.');
        }
        const minutosValidos = ['00', '40'];
        if (!minutosValidos.includes(minStr)) {
          return helpers.message('Intervalos válidos: cada 40 minutos o 1 hora (00, 40).');
        }
      }
      if (dayOfWeek === 6) {
        if (horaNum < 12 || horaNum > 15 || (horaNum === 15 && minStr !== '00')) {
          return helpers.message('Horario de odontología general: sábados 12:00 a 15:00.');
        }
        if (minStr !== '00') {
          return helpers.message('Los sábados solo se permiten intervalos de 1 hora (00).');
        }
      }
    }
    return value;
  })
  .messages({
    'any.required': 'El campo fecha es requerido.',
  });

const hora = Joi.string()
  .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
  .required()
  .messages({
    'any.required': 'El campo hora es requerido.',
    'string.pattern.base': 'El campo hora debe estar en formato HH:mm (24 horas).',
  });

// Esquemas para las operaciones
const createCitaSchema = Joi.object({
  documentoCliente,
  nombreCliente,
  apellidoCliente,
  servicio,
  doctora,
  consultorio,
  fecha,
  hora,
});

const updateCitaSchema = Joi.object({
  _id,
  documentoCliente,
  nombreCliente,
  apellidoCliente,
  servicio,
  doctora,
  consultorio,
  fecha,
  hora,
});

const getCitaSchema = Joi.object({
  _id,
});

const deleteCitaSchema = Joi.object({
  _id,
});

export {
  createCitaSchema,
  updateCitaSchema,
  getCitaSchema,
  deleteCitaSchema,
};