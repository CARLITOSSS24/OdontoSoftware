import servSchema from "../models/modelOdoServicios.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
  createServicioSchema,
  getServicioIdSchema,
  updateServicioSchema,
  deleteServicioSchema,
} from "../validators/validatorOdoServicios.js";

export const createServicio = [
  validatorHandler(createServicioSchema, "body"),
  async (req, res) => {
    try {
      const { Nombre, Descripcion, Disponible, Precio } = req.body;
      const servicio = new servSchema({ Nombre, Descripcion, Disponible, Precio });
      const data = await servicio.save();
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

export const updateServicio = [
  validatorHandler(getServicioIdSchema, "params"),
  validatorHandler(updateServicioSchema, "body"),
  async (req, res) => {
    const { _id } = req.params;
    const { Nombre, Descripcion, Disponible, Precio } = req.body;

    try {
      const ServUpdate = await servSchema.updateOne(
        { _id: _id },
        { $set: { Nombre, Descripcion, Disponible, Precio } }
      );
      if (ServUpdate.matchedCount === 0) {
        return res.status(404).json({ message: "Servicio no encontrado" });
      }
      if (ServUpdate.modifiedCount === 0) {
        return res.status(400).json({ message: "No se realizaron cambios en el servicio" });
      }
      res.status(200).json({ message: "Servicio actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];


export const getServicio = (req, resp) => {
  servSchema
    .find()
    .then((data) => resp.json(data))
    .catch((error) => resp.status(500).json({ message: error.message }));
};

export const getServicioId = [
  validatorHandler(getServicioIdSchema, "params"),
  async (req, resp) => {
    const { _id } = req.params;
    try {
      const servicio = await servSchema.findById(_id);
      if (!servicio) {
        return resp.status(404).json({ message: "Categoria no encontrada" });
      }
      resp.json(servicio);
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];



export const deleteServicio = [
  validatorHandler(deleteServicioSchema, "params"),
  async (req, resp) => {
    const { _id } = req.params;
    try {
      const result = await servSchema.deleteOne({ _id: _id });
      if (result.deletedCount === 0) {
        resp.status(404).json({ message: "Categoria no encontrada" });
      }
      resp.status(200).json({ message: "Categoria eliminada correctamente" });
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  },
];
