import express from "express";
import { 
    updateServicio, 
    deleteServicio, 
    createServicio, 
    getServicio, 
    getServicioId 
} from "../controller/controlOdoServicios.js";
import { verifyJWT, verifyRole } from "../config/middlewareOdoAutenticacion.js";


const modelOdoServicios = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Servicios
 *     description: Endpoints para manejar Servicios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Serv:
 *       type: object
 *       required:
 *         - Nombre
 *         - Descripcion
 *         - Disponible
 *         - Precio
 *       properties:
 *         Nombre:
 *           type: string
 *           description: Nombre del servicio.
 *         Descripcion:
 *           type: string
 *           description: Descripción detallada del servicio.
 *         Disponible:
 *           type: string
 *           enum: ["Activo", "Inactivo"]
 *           description: Estado de disponibilidad del servicio (Activo o Inactivo).
 *         Precio:
 *           type: number
 *           description: Precio del servicio.
 *       example:
 *         Nombre: "Limpieza Dental"
 *         Descripcion: "Tratamiento de limpieza dental profunda."
 *         Disponible: "Activo"
 *         Precio: 100
 */
                  
/** 
 * @swagger
 * /servicio:
 *   post:
 *     summary: Crear un nuevo servicio
 *     description: Permite crear un nuevo servicio.
 *     tags: [Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Serv'
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente.
 *       400:
 *         description: Error en la información del servicio.
 */
modelOdoServicios.post("/servicio", verifyJWT, verifyRole(['ADMIN', 'DOCTORA']), createServicio);;

/**
 * @swagger
 * /servicio:
 *   get:
 *     summary: Obtener todos los servicios
 *     description: Devuelve una lista de todos los servicios.
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Lista de servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Serv'
 */
modelOdoServicios.get("/servicio", verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), getServicio);

/**
 * @swagger
 * /servicio/{_id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     description: Devuelve los detalles de un servicio específico usando su ID.
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID del servicio que se desea obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del servicio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Serv'
 *       404:
 *         description: Servicio no encontrado
 */
modelOdoServicios.get("/servicio/:_id", verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), getServicioId);

/**
 * @swagger
 * /servicio/{_id}:
 *   patch:
 *     summary: Actualizar un servicio existente
 *     description: Permite actualizar los datos de un servicio existente.
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID del servicio que se desea actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Serv'
 *     responses:
 *       200:
 *         description: El servicio ha sido actualizado exitosamente
 *       400:
 *         description: Error en los datos del servicio
 *       404:
 *         description: Servicio no encontrado
 */
modelOdoServicios.patch("/servicio/:_id", verifyJWT, verifyRole(['ADMIN', 'DOCTORA']), updateServicio);

/**
 * @swagger
 * /servicio/{_id}:
 *   delete:
 *     summary: Eliminar un servicio
 *     description: Permite eliminar un servicio por su ID.
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID del servicio a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Servicio eliminado exitosamente
 *       404:
 *         description: Servicio no encontrado
 */
modelOdoServicios.delete("/servicio/:_id", verifyJWT, verifyRole(['ADMIN']), deleteServicio);

export default modelOdoServicios;

