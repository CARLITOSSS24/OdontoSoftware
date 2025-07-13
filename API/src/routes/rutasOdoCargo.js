import express from 'express';
import {
  crearCargo,
  obtenerCargos,
  obtenerCargoPorId,
  actualizarCargo,
  eliminarCargo
} from '../controller/controlOdoCargo.js';
import { verifyJWT, verifyRole } from '../config/middlewareOdoAutenticacion.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cargo
 *     description: Operaciones relacionadas con los cargos
 */

/**
 * @swagger
 * /cargo:
 *   post:
 *     summary: Crear un nuevo cargo
 *     tags: [Cargo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 maxLength: 40
 *                 example: Odontóloga General
 *     responses:
 *       201:
 *         description: Cargo creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/cargo', verifyJWT, verifyRole(['ADMIN']), crearCargo);

/**
 * @swagger
 * /cargo:
 *   get:
 *     summary: Obtener todos los cargos
 *     tags: [Cargo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cargos
 */
router.get('/cargo', verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), obtenerCargos);

/**
 * @swagger
 * /cargo/{id}:
 *   get:
 *     summary: Obtener un cargo por ID
 *     tags: [Cargo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cargo
 *     responses:
 *       200:
 *         description: Cargo encontrado
 *       404:
 *         description: Cargo no encontrado
 */
router.get('/cargo/:id', verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), obtenerCargoPorId);

/**
 * @swagger
 * /cargo/{id}:
 *   patch:
 *     summary: Actualizar un cargo
 *     tags: [Cargo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cargo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 maxLength: 40
 *                 example: Odontóloga General
 *     responses:
 *       200:
 *         description: Cargo actualizado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Cargo no encontrado
 */
router.patch('/cargo/:id', verifyJWT, verifyRole(['ADMIN']), actualizarCargo);

/**
 * @swagger
 * /cargo/{id}:
 *   delete:
 *     summary: Eliminar un cargo
 *     tags: [Cargo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cargo
 *     responses:
 *       200:
 *         description: Cargo eliminado correctamente
 *       404:
 *         description: Cargo no encontrado
 */
router.delete('/cargo/:id', verifyJWT, verifyRole(['ADMIN']), eliminarCargo);

export default router; 