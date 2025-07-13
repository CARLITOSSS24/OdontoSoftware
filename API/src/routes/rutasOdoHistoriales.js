import express from 'express';
import {
  crearHistorial,
  agregarControl,
  obtenerHistorialPorPaciente,
  obtenerHistorialPorId,
  obtenerHistoriales,
  actualizarHistorial,
  eliminarHistorial
} from '../controller/controlOdoHistoriales.js';
import { historialClinicoValidator } from '../validators/validatorsOdoHistorial.js';
import { verifyJWT, verifyRole } from '../config/middlewareOdoAutenticacion.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Historiales
 *     description: Endpoints para gestionar historiales clínicos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Historial:
 *       type: object
 *       required:
 *         - paciente
 *         - cita
 *         - servicio
 *         - doctora
 *         - consultorio
 *         - descripcionTratamiento
 *         - fechaAtencion
 *       properties:
 *         paciente:
 *           type: string
 *           description: ID del paciente
 *         cita:
 *           type: string
 *           description: ID de la cita asociada
 *         servicio:
 *           type: string
 *           description: ID del servicio relacionado
 *         doctora:
 *           type: string
 *           description: ID de la doctora responsable
 *         consultorio:
 *           type: string
 *           description: ID del consultorio donde se atendió
 *         descripcionTratamiento:
 *           type: string
 *           description: Descripción del tratamiento realizado
 *         fechaAtencion:
 *           type: string
 *           format: date
 *           description: Fecha en la que se realizó la atención
 *         observaciones:
 *           type: string
 *           description: Observaciones adicionales
 *         archivoAdjunto:
 *           type: string
 *           description: Ruta o URL del archivo adjunto
 *       example:
 *         paciente: "661acb937f31a7f4024ae1d4"
 *         cita: "661acf1c7f31a7f4024ae1d5"
 *         servicio: "661acf8f7f31a7f4024ae1d6"
 *         doctora: "661acff97f31a7f4024ae1d7"
 *         consultorio: "661ad0437f31a7f4024ae1d8"
 *         descripcionTratamiento: "Limpieza dental profunda"
 *         fechaAtencion: "2025-04-18"
 *         observaciones: "Paciente con sensibilidad dental"
 *         archivoAdjunto: "uploads/archivo.pdf"
 */

// Crear historial clínico (único por paciente)
/**
 * @swagger
 * /historiales:
 *   post:
 *     summary: Crear un nuevo historial clínico
 *     tags: [Historiales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Historial'
 *     responses:
 *       201:
 *         description: Historial creado correctamente
 *       400:
 *         description: Error de validación
 */
router.post('/historiales', verifyJWT, verifyRole(['ADMIN', 'DOCTORA']), crearHistorial);

// Agregar control a un historial existente
router.post('/historiales/:id/agregar-control', verifyJWT, verifyRole(['ADMIN', 'DOCTORA']), agregarControl);

// Obtener historial por paciente
/**
 * @swagger
 * /historiales/paciente/{idPaciente}:
 *   get:
 *     summary: Obtener todos los historiales clínicos de un paciente
 *     tags: [Historiales]
 *     parameters:
 *       - in: path
 *         name: idPaciente
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de historiales del paciente
 */
router.get('/historiales/paciente/:idPaciente', verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), obtenerHistorialPorPaciente);

// Obtener historial por ID
/**
 * @swagger
 * /historiales/{id}:
 *   get:
 *     summary: Obtener un historial clínico por ID
 *     tags: [Historiales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historial encontrado
 *       404:
 *         description: No se encontró el historial
 */
router.get('/historiales/:id', verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), obtenerHistorialPorId);

// Listar todos los historiales
/**
 * @swagger
 * /historiales:
 *   get:
 *     summary: Obtener todos los historiales clínicos
 *     tags: [Historiales]
 *     responses:
 *       200:
 *         description: Lista de historiales
 */
router.get('/historiales', verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), obtenerHistoriales);

// Actualizar historial
/**
 * @swagger
 * /historiales/{id}:
 *   patch:
 *     summary: Actualizar un historial clínico por ID
 *     tags: [Historiales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Historial'
 *     responses:
 *       200:
 *         description: Historial actualizado
 *       400:
 *         description: Error de validación
 *       404:
 *         description: No se encontró el historial
 */
router.patch('/historiales/:id', verifyJWT, verifyRole(['ADMIN', 'DOCTORA']), historialClinicoValidator, actualizarHistorial);

// Eliminar historial
/**
 * @swagger
 * /historiales/{id}:
 *   delete:
 *     summary: Eliminar un historial clínico por ID
 *     tags: [Historiales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historial eliminado
 *       404:
 *         description: No se encontró el historial
 */
router.delete('/historiales/:id', verifyJWT, verifyRole(['ADMIN']), eliminarHistorial);

export default router;
