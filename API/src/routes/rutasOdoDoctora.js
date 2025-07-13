import express from "express";
import { 
    CreateDoctora, 
    BuscarDoctora, 
    BuscarDoctoraID, 
    UpdateDoctora, 
    DeleteDoctora 
} from "../controller/controlOdoDoctora.js";
import { verifyJWT, verifyRole } from "../config/middlewareOdoAutenticacion.js";

const router = express.Router();  

/**
 * @swagger
 * tags:
 *   - name: Doctora
 *     description: Endpoints para gestionar las doctoras
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctora:
 *       type: object
 *       required:
 *         - Nombres
 *         - Apellidos
 *         - Tipo_Doc
 *         - Doc_identificacion
 *         - Telefono
 *         - Correo
 *         - Clave
 *         - Permiso
 *         - Genero
 *         - Edad
 *         - Id_consultorio
 *         - cargo
 *       properties:
 *         Nombres:
 *           type: string
 *           description: Nombres de la doctora.
 *           maxLength: 50
 *         Apellidos:
 *           type: string
 *           description: Apellidos de la doctora.
 *           maxLength: 50
 *         Tipo_Doc:
 *           type: string
 *           enum: [RC, TI, CC, TE, CE, NIT, PP, PEP, DIE, PA]
 *           description: Tipo de documento de identidad.
 *         Doc_identificacion:
 *           type: string
 *           description: Número de documento de identidad.
 *           unique: true
 *         Telefono:
 *           type: number
 *           description: Número de teléfono de contacto.
 *         Correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico de contacto.
 *           pattern: ^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$
 *         Clave:
 *           type: string
 *           description: Clave de acceso de la doctora (mínimo 6 caracteres).
 *           minLength: 6
 *         Permiso:
 *           type: string
 *           format: uuid
 *           description: ID del permiso asignado a la doctora.
 *         Genero:
 *           type: string
 *           enum: [Masculino, Femenino, Otro]
 *           description: Género de la doctora.
 *         Edad:
 *           type: number
 *           minimum: 0
 *           maximum: 120
 *           description: Edad de la doctora.
 *         Id_consultorio:
 *           type: string
 *           format: uuid
 *           description: ID del consultorio asignado a la doctora.
 *         cargo:
 *           type: string
 *           format: uuid
 *           description: ID del cargo asignado a la doctora.
 *       example:
 *         Nombres: "Ana Maria"
 *         Apellidos: "Gomez Perez"
 *         Tipo_Doc: "CC"
 *         Doc_identificacion: "1234567890"
 *         Telefono: 3201234567
 *         Correo: "ana.gomez@example.com"
 *         Clave: "claveSegura123"
 *         Permiso: "6820f7ab14cd039b43a1f668"
 *         Genero: "Femenino"
 *         Edad: 35
 *         Id_consultorio: "6620f7ab14cd039b43a1f111"
 *         cargo: "6620f7ab14cd039b43a1f222"
 */

/**
 * @swagger
 * /doctora:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Registrar una nueva doctora
 *     description: Crea un nuevo registro de doctora en el sistema. Requiere autenticación y rol de ADMIN o DOCTORA.
 *     tags: [Doctora]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctora'
 *           example:
 *             Nombres: "Ana Maria"
 *             Apellidos: "Gomez Perez"
 *             Tipo_Doc: "CC"
 *             Doc_identificacion: "1234567890"
 *             Telefono: 3201234567
 *             Correo: "ana.gomez@example.com"
 *             Clave: "claveSegura123"
 *             Permiso: "6820f7ab14cd039b43a1f668"
 *             Genero: "Femenino"
 *             Edad: 35
 *             Id_consultorio: "6620f7ab14cd039b43a1f111"
 *             cargo: "6620f7ab14cd039b43a1f222"
 *     responses:
 *       201:
 *         description: Registro de doctora creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctora'
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Datos obligatorios faltantes."
 *       401:
 *         description: No autorizado. Token no proporcionado o inválido.
 *       403:
 *         description: Acceso denegado. Rol no permitido.
 */
router.post("/doctora", verifyJWT, verifyRole(['ADMIN', 'DOCTORA']), CreateDoctora);

/**
 * @swagger
 * /doctora:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retorna los registros de la entidad Doctora
 *     description: Retorna los registros de todas las doctoras. Requiere autenticación y rol de ADMIN, DOCTORA, RECEPCIONISTA o PACIENTE.
 *     tags:
 *       - Doctora
 *     responses:
 *       200:
 *         description: Lista de doctoras
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctora'
 *       401:
 *         description: No autorizado. Token no proporcionado o inválido.
 *       403:
 *         description: Acceso denegado. Rol no permitido.
 */
router.get("/doctora", verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), BuscarDoctora);

/**
 * @swagger
 * /doctora/{_id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retorna el registro por ID de la entidad Doctora
 *     description: Retorna el registro de una doctora por su ID. Requiere autenticación y rol de ADMIN, DOCTORA, RECEPCIONISTA o PACIENTE.
 *     tags:
 *       - Doctora
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID de la doctora a buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles de la doctora
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctora'
 *       401:
 *         description: No autorizado. Token no proporcionado o inválido.
 *       403:
 *         description: Acceso denegado. Rol no permitido.
 *       404:
 *         description: No se encontró la doctora con ese ID
 */
router.get("/doctora/:_id", verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), BuscarDoctoraID);

/**
 * @swagger
 * /doctora/{_id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Actualiza los datos de una doctora
 *     description: Actualiza el registro de una doctora en la base de datos. Requiere autenticación y rol de ADMIN o DOCTORA.
 *     tags:
 *       - Doctora
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID de la doctora a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctora'
 *     responses:
 *       200:
 *         description: Doctora actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctora'
 *       401:
 *         description: No autorizado. Token no proporcionado o inválido.
 *       403:
 *         description: Acceso denegado. Rol no permitido.
 *       404:
 *         description: No se encontró la doctora con ese ID
 *       400:
 *         description: Error en los datos enviados para la actualización
 */
router.patch("/doctora/:_id", verifyJWT, verifyRole(['ADMIN', 'DOCTORA']), UpdateDoctora);

/**
 * @swagger
 * /doctora/{_id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Elimina una doctora de la base de datos
 *     description: Elimina el registro de una doctora por su ID. Requiere autenticación y rol de ADMIN.
 *     tags:
 *       - Doctora
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID de la doctora a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctora eliminada correctamente
 *       401:
 *         description: No autorizado. Token no proporcionado o inválido.
 *       403:
 *         description: Acceso denegado. Rol no permitido.
 *       404:
 *         description: No se encontró la doctora con ese ID
 */
router.delete("/doctora/:_id", verifyJWT, verifyRole(['ADMIN']), DeleteDoctora);

export default router;
