import { body } from 'express-validator';

export const historialClinicoValidator = [
  body('paciente').notEmpty().withMessage('El paciente es obligatorio'),
  body('responsable_creacion').notEmpty().withMessage('El odontólogo responsable es obligatorio'),
];

export const controlHistorialValidator = [
  body('fecha_control').notEmpty().withMessage('La fecha del control es obligatoria'),
  body('motivo_consulta').notEmpty().withMessage('El motivo de consulta es obligatorio'),
  body('diagnostico').notEmpty().withMessage('El diagnóstico es obligatorio'),
  body('procedimiento_realizado').notEmpty().withMessage('El procedimiento realizado es obligatorio'),
  body('odontologo_responsable').notEmpty().withMessage('El odontólogo responsable es obligatorio'),
];