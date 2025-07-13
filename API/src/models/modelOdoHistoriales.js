// models/HistorialClinico.js
import mongoose from "mongoose";

const controlSchema = new mongoose.Schema({
  fecha_control: { type: Date, required: true, default: Date.now },
  motivo_consulta: { type: String, required: true },
  diagnostico: { type: String, required: true },
  procedimiento_realizado: { type: String, required: true },
  tratamiento_propuesto: { type: String },
  evolucion: { type: String },
  recomendaciones: { type: String },
  odontologo_responsable: { type: mongoose.Schema.Types.ObjectId, ref: "Doctora", required: true }
}, { _id: true });

const historialClinicoSchema = new mongoose.Schema({
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true, unique: true },
  fecha_creacion: { type: Date, default: Date.now },
  observaciones_generales: { type: String },
  responsable_creacion: { type: mongoose.Schema.Types.ObjectId, ref: "Doctora", required: true },
  controles: [controlSchema]
});

export default mongoose.model("HistorialClinico", historialClinicoSchema);
