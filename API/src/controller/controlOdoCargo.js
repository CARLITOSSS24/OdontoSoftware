import Cargo from '../models/modelOdoCargo.js';
import { createCargoSchema, updateCargoSchema } from '../validators/validatorOdoCargo.js';

export const crearCargo = async (req, res) => {
  try {
    const { error } = createCargoSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const cargo = new Cargo(req.body);
    const data = await cargo.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear cargo', error: err.message });
  }
};

export const obtenerCargos = async (req, res) => {
  try {
    const cargos = await Cargo.find();
    res.json(cargos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener cargos', error: err.message });
  }
};

export const obtenerCargoPorId = async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id);
    if (!cargo) return res.status(404).json({ message: 'Cargo no encontrado' });
    res.json(cargo);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener cargo', error: err.message });
  }
};

export const actualizarCargo = async (req, res) => {
  try {
    const { error } = updateCargoSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const cargo = await Cargo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cargo) return res.status(404).json({ message: 'Cargo no encontrado' });
    res.json({ message: 'Cargo actualizado correctamente', data: cargo });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar cargo', error: err.message });
  }
};

export const eliminarCargo = async (req, res) => {
  try {
    const cargo = await Cargo.findByIdAndDelete(req.params.id);
    if (!cargo) return res.status(404).json({ message: 'Cargo no encontrado' });
    res.json({ message: 'Cargo eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar cargo', error: err.message });
  }
}; 