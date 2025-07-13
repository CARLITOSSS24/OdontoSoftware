import HistorialClinico from '../models/modelOdoHistoriales.js';
import Usuario from '../models/modelOdoUser.js';
import Doctora from '../models/modelOdoDoctora.js';

// Crear historial clínico (solo si no existe para el paciente)
export const crearHistorial = async (req, res) => {
  try {
    const { paciente, observaciones_generales, responsable_creacion } = req.body;
    // Verifica que el paciente exista
    const existePaciente = await Usuario.findById(paciente);
    if (!existePaciente) return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    // Verifica que el odontólogo exista
    const existeDoctor = await Doctora.findById(responsable_creacion);
    if (!existeDoctor) return res.status(404).json({ mensaje: 'Odontólogo responsable no encontrado' });
    // Verifica que no exista historial para el paciente
    const existeHistorial = await HistorialClinico.findOne({ paciente });
    if (existeHistorial) return res.status(400).json({ mensaje: 'El paciente ya tiene un historial clínico' });
    // Crea el historial
    const historial = new HistorialClinico({ paciente, observaciones_generales, responsable_creacion });
    const historialGuardado = await historial.save();
    res.status(201).json(historialGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear historial', error });
  }
};

// Agregar un control a un historial existente
export const agregarControl = async (req, res) => {
  try {
    const { id } = req.params; // id del historial
    const control = req.body;
    // Verifica que el historial exista
    const historial = await HistorialClinico.findById(id);
    if (!historial) return res.status(404).json({ mensaje: 'Historial no encontrado' });
    // Verifica que el odontólogo responsable exista
    const existeDoctor = await Doctora.findById(control.odontologo_responsable);
    if (!existeDoctor) return res.status(404).json({ mensaje: 'Odontólogo responsable no encontrado' });
    // Agrega el control
    historial.controles.push(control);
    await historial.save();
    res.status(201).json({ mensaje: 'Control agregado correctamente', historial });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al agregar control', error });
  }
};

// Obtener historial por paciente (timeline)
export const obtenerHistorialPorPaciente = async (req, res) => {
  try {
    const { idPaciente } = req.params;
    const historial = await HistorialClinico.findOne({ paciente: idPaciente })
      .populate('paciente')
      .populate('responsable_creacion')
      .populate('controles.odontologo_responsable');
    if (!historial) return res.status(404).json({ mensaje: 'Historial no encontrado' });
    res.json(historial);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener historial', error });
  }
};

// Obtener historial por ID
export const obtenerHistorialPorId = async (req, res) => {
  try {
    const historial = await HistorialClinico.findById(req.params.id)
      .populate('paciente')
      .populate('responsable_creacion')
      .populate('controles.odontologo_responsable');
    if (!historial) return res.status(404).json({ mensaje: 'Historial no encontrado' });
    res.json(historial);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener historial', error });
  }
};

// Listar todos los historiales (opcional, para administración)
export const obtenerHistoriales = async (req, res) => {
  try {
    const historiales = await HistorialClinico.find()
      .populate('paciente')
      .populate('responsable_creacion')
      .populate('controles.odontologo_responsable');
    res.json(historiales);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener historiales', error });
  }
};

export const actualizarHistorial = async (req, res) => {
  try {
    const historial = await HistorialClinico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!historial) return res.status(404).json({ mensaje: 'Historial no encontrado' });
    res.json(historial);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar historial', error });
  }
};

export const eliminarHistorial = async (req, res) => {
  try {
    const historial = await HistorialClinico.findByIdAndDelete(req.params.id);
    if (!historial) return res.status(404).json({ mensaje: 'Historial no encontrado' });
    res.json({ mensaje: 'Historial eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar historial', error });
  }
};