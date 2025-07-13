import consultorioSchema from "../models/modelOdoConsultorios.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
  createConsultorioSchema,
  getConsultorioSchema,
  updateConsultorioSchema,
  deleteConsultorioSchema,
} from "../validators/validatorOdoConsultorios.js";

export const crearconsultorio = [
  validatorHandler(createConsultorioSchema, "body"), 
  async (req, res) => {
    try {
      const consultorio = new consultorioSchema(req.body); 
      const data = await consultorio.save(); 
      res.status(201).json(data); 
    } catch (error) {
      res.status(500).json({ message: error.message }); 
    }
  },
];

export const llamarConsultorio = async (req, res) => {
  try {
    const data = await consultorioSchema.find(); 
    res.json(data); 
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
};

export const llamarConsultorioId = [
  validatorHandler(getConsultorioSchema, "params"), 
  async (req, res) => {
    const { _id } = req.params; 
    try {
      const consultorio = await consultorioSchema.findById(_id); 
      if (!consultorio) {
        return res.status(404).json({ message: "Consultorio no encontrado" }); 
      }
      res.json(consultorio); 
    } catch (error) {
      res.status(500).json({ message: error.message }); 
    }
  },
];

export const ActualizarConsultorio = [
  validatorHandler(getConsultorioSchema, "params"), 
  validatorHandler(updateConsultorioSchema, "body"), 
  async (req, res) => {
    const { _id } = req.params; 
    const { Nombre_consultorio } = req.body; 
    try {
      const currentConsultorio = await consultorioSchema.findById(_id);
      if (!currentConsultorio) {
        return res.status(404).json({ message: "Consultorio no encontrado" });
      }
      const consultorioUpdate = await consultorioSchema.updateOne(
        { _id: _id },
        { $set: { Nombre_consultorio } } 
      );
      if (consultorioUpdate.matchedCount === 0) {
        return res.status(404).json({ message: "Consultorio no encontrado" });
      }
      if (consultorioUpdate.modifiedCount === 0) {
        return res.status(400).json({ message: "No se realizaron cambios en el Consultorio" });
      }
      res.status(200).json({ message: "Consultorio actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

export const borrarConsultorio = [
  validatorHandler(deleteConsultorioSchema, "params"), 
  async (req, res) => {
    const { _id } = req.params; 
    try {
      const result = await consultorioSchema.deleteOne({ _id: _id }); 
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Consultorio no encontrado" });
      }
      res.status(200).json({ message: "Consultorio eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];
