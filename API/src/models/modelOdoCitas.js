import mongoose from 'mongoose';

const CitaSchema = new mongoose.Schema({
  documentoCliente: {
    type: String,
    required: true,
  },
  nombreCliente: {
    type: String,
    required: true,
  },
  apellidoCliente: {
    type: String,
    required: true,
  },
  servicios: {  // Campo en plural que referencia a "Servicios"
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicios',  // Debe coincidir exactamente con el nombre del modelo
    required: true,
  },
  doctora: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctora',
    required: true,
  },
  consultorio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultorio',
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  hora: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'Terminado'],
    default: 'Pendiente',
  },
});

const ReporteCitaSchema = new mongoose.Schema({
  documentoCliente: String,
  nombreCliente: String,
  apellidoCliente: String,
  servicios: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicios',
    required: true,
  },
  doctora: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctora',
    required: true,
  },
  consultorio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultorio',
    required: true,
  },
  fecha: Date,
  hora: String,
  estado: String,
  fechaConfirmacion: { type: Date, default: Date.now },
}, { timestamps: true });

export const ReporteCita = mongoose.model('ReporteCita', ReporteCitaSchema);

export default mongoose.model('Cita', CitaSchema);