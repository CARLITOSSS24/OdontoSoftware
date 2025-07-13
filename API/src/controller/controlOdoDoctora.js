import doctoraSchema from "../models/modelOdoDoctora.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
  createDoctoraSchema,
  updateDoctoraSchema,
  buscarDoctoraIDSchema,
  deleteDoctoraSchema,
} from "../validators/validatorOdoDoctora.js";
import bcrypt from "bcryptjs";

export const CreateDoctora = [
  validatorHandler(createDoctoraSchema, "body"),
  async (req, res) => {
    try {
      console.log("Clave recibida:", req.body.Clave);
      if (req.body.Clave) {
        req.body.Clave = await bcrypt.hash(req.body.Clave, 10);
        console.log("Clave hasheada:", req.body.Clave);
      }
      const doctora = new doctoraSchema(req.body);
      const data = await doctora.save();
      const populated = await doctoraSchema.findById(data._id).populate('cargo');
      const { Clave, ...rest } = populated.toObject();
      res.status(201).json(rest); 
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

export const BuscarDoctora = async (req, res) => {
  try {
    const data = await doctoraSchema.find()
      .populate('Id_consultorio')
      .populate('Permiso')
      .populate('cargo');
    const doctoraData = data.map(doc => {
      const { Clave, ...rest } = doc.toObject();
      return rest;
    });
    res.json(doctoraData); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const BuscarDoctoraID = [
  validatorHandler(buscarDoctoraIDSchema, "params"),
  async (req, res) => {
    const { _id } = req.params; 
    try {
      const doctora = await doctoraSchema.findById(_id)
        .populate('Id_consultorio')
        .populate('Permiso')
        .populate('cargo'); 
      if (!doctora) {
        return res.status(404).json({ message: "Doctora no encontrada" }); 
      }
      const { Clave, ...rest } = doctora.toObject();
      res.json(rest); 
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

export const UpdateDoctora = [
  validatorHandler(buscarDoctoraIDSchema, "params"),
  validatorHandler(updateDoctoraSchema, "body"),
  async (req, res) => {
    const { _id } = req.params; 
    const updateFields = { ...req.body };
    try {
      console.log("Clave recibida para update:", updateFields.Clave);
      if (updateFields.Clave) {
        updateFields.Clave = await bcrypt.hash(updateFields.Clave, 10);
        console.log("Clave hasheada para update:", updateFields.Clave);
      }
      const doctoraUpdate = await doctoraSchema.findByIdAndUpdate(
        _id, 
        { $set: updateFields },
        { new: true }
      ).populate('cargo');
      if (!doctoraUpdate) {
        return res.status(404).json({ message: "Doctora no encontrada" }); 
      }
      if (doctoraUpdate.modifiedCount === 0) {
        return res.status(400).json({ message: "No se realizaron cambios en la doctora" }); 
      }
      res.status(200).json({ message: "Doctora actualizada correctamente", data: doctoraUpdate });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

export const DeleteDoctora = [
  validatorHandler(deleteDoctoraSchema, "params"),
  async (req, res) => {
    const { _id } = req.params; 
    try {
      const result = await doctoraSchema.deleteOne({ _id }); 
      if (result.deletedCount === 1) {
        return res.status(200).json({ message: "Doctora eliminada con éxito" });
      }
      return res.status(404).json({ message: "Doctora no encontrada" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];
