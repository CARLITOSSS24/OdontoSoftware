import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         Nombre:
 *           type: string
 *         Apellido:
 *           type: string
 *         Tipo_Doc:
 *           type: string
 *           enum: [RC, TI, CC, TE, CE, NIT, PP, PEP, DIE, PA]
 *         Doc_identificacion:
 *           type: string
 *         Telefono:
 *           type: number
 *         Correo:
 *           type: string
 *         Clave:
 *           type: string
 *         Permiso:
 *           type: string
 *         Genero:
 *           type: string
 *           enum: [Masculino, Femenino, Otro]
 *         Edad:
 *           type: number
 *         resetPasswordCode:
 *           type: string
 *           nullable: true
 *         resetPasswordExpires:
 *           type: string
 *           format: date-time
 *           nullable: true
 */

const usuarioSchema = mongoose.Schema({
  Nombre: {
    type: String, 
    required: [true, 'El nombre es obligatorio'], 
  },
  Apellido: {
    type: String, 
    required: [true, 'El apellido es obligatorio'], 
  },
  Tipo_Doc: {
    type: String, 
    required: [true, 'El tipo de documento es obligatorio'], 
    enum: {
      values: [
        'RC', // Registro Civil de Nacimiento
        'TI', // Tarjeta de Identidad
        'CC', // Cédula de Ciudadanía
        'TE', // Tarjeta de Extranjería
        'CE', // Cédula de Extranjería
        'NIT', // Número de Identificación Tributaria
        'PP', // Pasaporte
        'PEP', // Permiso Especial de Permanencia
        'DIE', // Documento de Identificación Extranjero
        'PA' // (Si quieres mantenerlo por compatibilidad)
      ], 
      message: 'El tipo de documento debe ser uno de los siguientes valores: RC, TI, CC, TE, CE, NIT, PP, PEP, DIE, PA', 
    },
  },
  Doc_identificacion: {
    type: String,
    required: [true, "El documento de identificación es obligatorio"],
    unique: true,
    trim: true,
  },
  Telefono: {
    type: Number, 
    required: [true, 'El número de teléfono es obligatorio'], 
  },
  Correo: {
    type: String, 
    required: [true, 'El correo es obligatorio'], 
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'El correo no tiene un formato válido', 
    ],
  },
  Clave: {
    type: String, 
    required: [true, 'La clave es obligatoria'], 
    minlength: [8, 'La clave debe tener al menos 8 caracteres'], 
  },
  Permiso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Permiso",
    required: true,
  },
  Genero: {
    type: String,
    required: [true, 'El género es obligatorio'],
    enum: {
      values: ['Masculino', 'Femenino', 'Otro'],
      message: 'El género debe ser Masculino, Femenino u Otro',
    },
  },
  Edad: {
    type: Number,
    required: [true, 'La edad es obligatoria'],
    min: [0, 'La edad no puede ser negativa'],
    max: [120, 'La edad no puede ser mayor a 120'],
  },
  resetPasswordCode: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  resetPasswordAttempts: {
    type: Number,
    default: 0
  },
  resetPasswordBlockedUntil: {
    type: Date,
    default: null
  },
  emailVerificationCode: {
    type: String,
    default: null
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  },
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, 
});

export default mongoose.model('Usuario', usuarioSchema);