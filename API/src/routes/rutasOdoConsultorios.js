import express from "express";
import { 
    ActualizarConsultorio, 
    borrarConsultorio, 
    crearconsultorio, 
    llamarConsultorio, 
    llamarConsultorioId 
} from "../controller/controlOdoConsultorios.js";
import { verifyJWT, verifyRole } from "../config/middlewareOdoAutenticacion.js";

const modelOdoConsultorio = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Consultorios
 *     description: Endpoints para gestionar consultorios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Consultorio:
 *       type: object
 *       required:
 *         - Nombre_consultorio
 *       properties:
 *         Nombre_consultorio:
 *           type: string
 *           description: Nombre del consultorio.
 *       example:
 *         Nombre_consultorio: "Consultorio Principal"
 */

/**
 * @swagger
 * /consultorios:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Crear un nuevo consultorio
 *     description: Permite crear un nuevo consultorio en la plataforma. Requiere autenticación y rol de "Admin".
 *     tags: [Consultorios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Consultorio'
 *     responses:
 *       201:
 *         description: Consultorio creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *                 consultorio:
 *                   $ref: '#/components/schemas/Consultorio'
 *             example:
 *               message: "Consultorio creado exitosamente."
 *               consultorio:
 *                 Nombre_consultorio: "Consultorio Principal"
 *       400:
 *         description: Error en la información del consultorio.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detalle del error.
 *             example:
 *               message: "Faltan datos obligatorios."
 *       401:
 *         description: Token no proporcionado o no válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detalle del error de autenticación.
 *             example:
 *               message: "Token no proporcionado."
 *       403:
 *         description: Acceso denegado. El usuario no tiene los permisos necesarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detalle del error de autorización.
 *             example:
 *               message: "Acceso denegado. Rol no permitido."
 */
modelOdoConsultorio.post("/consultorios", verifyJWT, verifyRole(['ADMIN', 'DOCTORA']), crearconsultorio);

/**
 * @swagger
 * /consultorios:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtener todos los consultorios
 *     description: Devuelve una lista con todos los consultorios existentes.
 *     tags: [Consultorios]
 *     responses:
 *       200:
 *         description: Lista de consultorios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consultorio'
 */
modelOdoConsultorio.get("/consultorios", verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), llamarConsultorio);

/**
 * @swagger
 * /consultorios/{_id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtener un consultorio por ID
 *     description: Devuelve los detalles de un consultorio específico usando su ID.
 *     tags: [Consultorios]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID del consultorio que se desea obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del consultorio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consultorio'
 *       404:
 *         description: Consultorio no encontrado
 */
modelOdoConsultorio.get("/consultorios/:_id", verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), llamarConsultorioId);

/**
 * @swagger
 * /consultorios/{_id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Actualizar un consultorio existente
 *     description: Permite actualizar los datos de un consultorio ya existente.
 *     tags: [Consultorios]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID del consultorio que se desea actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Consultorio'
 *     responses:
 *       200:
 *         description: Consultorio actualizado exitosamente
 *       400:
 *         description: Error en los datos del consultorio
 *       404:
 *         description: Consultorio no encontrado
 */
modelOdoConsultorio.patch("/consultorios/:_id", verifyJWT, verifyRole(['ADMIN', 'DOCTORA']), ActualizarConsultorio);

/**
 * @swagger
 * /consultorios/{_id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Eliminar un consultorio
 *     description: Permite eliminar un consultorio por su ID.
 *     tags: [Consultorios]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID del consultorio a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consultorio eliminado exitosamente
 *       404:
 *         description: Consultorio no encontrado
 */
modelOdoConsultorio.delete("/consultorios/:_id", verifyJWT, verifyRole(['ADMIN']), borrarConsultorio);

export default modelOdoConsultorio;
