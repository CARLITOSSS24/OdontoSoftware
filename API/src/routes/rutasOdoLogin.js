import express from "express";
import Login from "../controller/controlOdoLogin.js";
import {
  solicitarCodigo,
  verificarCodigo,
  restablecerPassword,
  cancelarSolicitud
} from "../controller/controlOdoPassword.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Login Autenticador
 *     description: Endpoint para manejar la autenticación de usuarios
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autenticar usuario
 *     description: Permite a un usuario iniciar sesión con su correo y contraseña.
 *     tags: [Login Autenticador]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Correo
 *               - Clave
 *             properties:
 *               Correo:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *               Clave:
 *                 type: string
 *                 description: Contraseña del usuario.
 *             example:
 *               Correo: "usuario@ejemplo.com"
 *               Clave: "12345"
 *     responses:
 *       200:
 *         description: Login correcto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT generado para la autenticación.
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Credenciales incorrectas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detalle del error.
 *             example:
 *               message: "Usuario no encontrado o clave incorrecta."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 *             example:
 *               message: "Error en el servidor."
 */
router.post("/login", Login);

// Recuperación de contraseña
router.post("/login/solicitar-codigo", solicitarCodigo);
router.post("/login/verificar-codigo", verificarCodigo);
router.post("/login/restablecer-contrasena", restablecerPassword);
router.post("/login/cancelar-solicitud", cancelarSolicitud);

export default router;
