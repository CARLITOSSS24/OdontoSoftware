import express from "express";
import { 
    createPermiso, 
    deletePermiso, 
    updatePermiso, 
    getPermisos, 
    getPermisoById 
} from "../controller/controlOdoPermisos.js";
import { verifyJWT, verifyRole } from "../config/middlewareOdoAutenticacion.js";

const modelOdoPermisos = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Permisos
 *     description: Endpoints para manejar permisos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Permiso:
 *       type: object
 *       properties:
 *         rol:
 *           type: string
 *           description: Rol asociado al permiso
 *       required:
 *         - rol
 */

/**
 * @swagger
 * /permisos:
 *   post:
 *     summary: Crear un nuevo permiso
 *     description: Permite crear un nuevo permiso.
 *     tags: [Permisos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permiso'
 *     responses:
 *       201:
 *         description: Permiso creado exitosamente
 *       400:
 *         description: Error en la información del permiso
 */
modelOdoPermisos.post("/permisos", verifyJWT, verifyRole(['ADMIN']), createPermiso);

/**
 * @swagger
 * /permisos:
 *   get:
 *     summary: Obtener todos los permisos
 *     description: Devuelve una lista de todos los permisos.
 *     tags: [Permisos]
 *     responses:
 *       200:
 *         description: Lista de permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permiso'
 */
modelOdoPermisos.get("/permisos", verifyJWT, verifyRole(['ADMIN', 'DOCTORA']), getPermisos);

/**
 * @swagger
 * /permisos/{_id}:
 *   get:
 *     summary: Obtener un permiso por ID
 *     description: Devuelve los detalles de un permiso específico usando su ID.
 *     tags: [Permisos]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID del permiso que se desea obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del permiso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permiso'
 *       404:
 *         description: Permiso no encontrado
 */
modelOdoPermisos.get("/permisos/:_id", verifyJWT, verifyRole(['ADMIN', 'DOCTORA']), getPermisoById);

/**
 * @swagger
 * /permisos/{_id}:
 *   patch:
 *     summary: Actualizar un permiso existente
 *     description: Permite actualizar los datos de un permiso existente.
 *     tags: [Permisos]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID del permiso que se desea actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permiso'
 *     responses:
 *       200:
 *         description: Permiso actualizado exitosamente
 *       400:
 *         description: Error en los datos del permiso
 *       404:
 *         description: Permiso no encontrado
 */
modelOdoPermisos.patch("/permisos/:_id", verifyJWT, verifyRole(['ADMIN']), updatePermiso);

/**
 * @swagger
 * /permisos/{_id}:
 *   delete:
 *     summary: Eliminar un permiso
 *     description: Permite eliminar un permiso por su ID.
 *     tags: [Permisos]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID del permiso a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permiso eliminado exitosamente
 *       404:
 *         description: Permiso no encontrado
 */
modelOdoPermisos.delete("/permisos/:_id", verifyJWT, verifyRole(['ADMIN']), deletePermiso);

export default modelOdoPermisos;

