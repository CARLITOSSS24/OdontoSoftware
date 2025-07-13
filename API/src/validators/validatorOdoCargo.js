import Joi from 'joi';

export const createCargoSchema = Joi.object({
  nombre: Joi.string().max(40).required().messages({
    'string.base': 'El nombre del cargo debe ser un texto.',
    'string.max': 'El nombre del cargo no puede tener más de 40 caracteres.',
    'any.required': 'El nombre del cargo es obligatorio.'
  })
});

export const updateCargoSchema = Joi.object({
  nombre: Joi.string().max(40).optional().messages({
    'string.base': 'El nombre del cargo debe ser un texto.',
    'string.max': 'El nombre del cargo no puede tener más de 40 caracteres.'
  })
}); 