import express from "express";
import {
  createCita,
  getCitas,
  getCitaById,
  updateCita,
  deleteCita,
  confirmarAsistencia,
} from "../controller/controlOdoCitas.js";
import { verifyJWT, verifyRole } from "../config/middlewareOdoAutenticacion.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Citas
 *     description: Operaciones relacionadas con las citas odontológicas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cita:
 *       type: object
 *       required:
 *         - documentoCliente
 *         - nombreCliente
 *         - apellidoCliente
 *         - servicios
 *         - doctora
 *         - consultorio
 *         - fecha
 *         - hora
 *       properties:
 *         documentoCliente:
 *           type: string
 *           description: Documento del cliente que solicita la cita.
 *         nombreCliente:
 *           type: string
 *           description: Nombre del cliente.
 *         apellidoCliente:
 *           type: string
 *           description: Apellido del cliente.
 *         servicios:
 *           type: string
 *           format: uuid
 *           description: ID del servicio solicitado.
 *         doctora:
 *           type: string
 *           format: uuid
 *           description: ID de la doctora asignada.
 *         consultorio:
 *           type: string
 *           format: uuid
 *           description: ID del consultorio asignado.
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha de la cita (formato YYYY-MM-DD).
 *         hora:
 *           type: string
 *           description: Hora de la cita (formato HH:mm).
 *       example:
 *         documentoCliente: "12345678"
 *         nombreCliente: "Juan"
 *         apellidoCliente: "Pérez"
 *         servicios: "64fbc1234567890abcdef123"
 *         doctora: "64fbc1234567890abcdef456"
 *         consultorio: "64fbc1234567890abcdef789"
 *         fecha: "2025-04-10"
 *         hora: "14:30"
 */

/**
 * @swagger
 * /citas:
 *   post:
 *     summary: Crear una nueva cita odontológica
 *     description: Crear una cita con detalles como cliente, servicio, doctora, consultorio, fecha y hora.
 *     tags: [Citas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cita'
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post("/citas", verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), createCita);

/**
 * @swagger
 * /citas:
 *   get:
 *     summary: Obtener todas las citas odontológicas
 *     description: Obtener una lista de todas las citas registradas.
 *     tags: [Citas]
 *     responses:
 *       200:
 *         description: Lista de citas
 *       500:
 *         description: Error del servidor
 */
router.get("/citas", verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), getCitas);

/**
 * @swagger
 * /citas/{_id}:
 *   get:
 *     summary: Obtener una cita odontológica por ID
 *     description: Obtener una cita específica por su ID.
 *     tags: [Citas]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: El ID de la cita a recuperar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cita encontrada exitosamente
 *       404:
 *         description: Cita no encontrada
 */
router.get("/citas/:_id", verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), getCitaById);

/**
 * @swagger
 * /citas/{_id}:
 *   patch:
 *     summary: Actualizar una cita odontológica
 *     description: Actualizar los detalles de una cita, incluyendo cliente, servicio, doctora, consultorio, fecha y hora.
 *     tags: [Citas]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: El ID de la cita a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cita'
 *     responses:
 *       200:
 *         description: Cita actualizada exitosamente
 *       400:
 *         description: Error en la solicitud de actualización
 *       404:
 *         description: Cita no encontrada
 */
router.patch("/citas/:_id", verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA']), updateCita);

/**
 * @swagger
 * /citas/{_id}/confirmar:
 *   patch:
 *     summary: Confirmar la asistencia a una cita odontológica
 *     description: Cambiar el estado de una cita a 'Terminado'.
 *     tags: [Citas]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: El ID de la cita a confirmar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cita confirmada exitosamente
 *       400:
 *         description: Error en la solicitud de confirmación
 *       404:
 *         description: Cita no encontrada
 */
router.patch("/citas/:_id/confirmar", verifyJWT, verifyRole(['DOCTORA', 'ADMIN']), confirmarAsistencia);

/**
 * @swagger
 * /citas/{_id}:
 *   delete:
 *     summary: Eliminar una cita odontológica
 *     description: Eliminar una cita específica por su ID.
 *     tags: [Citas]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: El ID de la cita a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cita eliminada exitosamente
 *       404:
 *         description: Cita no encontrada
 */
router.delete("/citas/:_id", verifyJWT, verifyRole(['ADMIN', 'DOCTORA']), deleteCita);

export default router;