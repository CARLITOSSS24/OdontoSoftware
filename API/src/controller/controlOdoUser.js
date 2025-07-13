import bcrypt from "bcryptjs";
import userSchema from "../models/modelOdoUser.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
  deleteUserSchema,
} from "../validators/validatorOdoUser.js";
import transporter from "../config/email.js";
import crypto from "crypto";

const handleError = (res, error, message) => {
  res.status(500).json({ message: `${message}: ${error.message}` });
};

function generarCodigoVerificacion() {
  return crypto.randomBytes(4).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 5);
}

export const crearusuario = [
  validatorHandler(createUserSchema, "body"),
  async (req, res) => {
    try {
      const {
        Nombre,
        Apellido,
        Tipo_Doc,
        Doc_identificacion,
        Telefono,
        Correo,
        Clave,
        Permiso,
        Genero,
        Edad,
      } = req.body;

      if (!Permiso) {
        return res.status(400).json({ message: "El campo Permiso es obligatorio" });
      }

      const hashedPassword = await bcrypt.hash(Clave, 10);
      const codigoVerificacion = generarCodigoVerificacion();
      const expiracion = Date.now() + 15 * 60 * 1000; // 15 minutos

      const user = new userSchema({
        Nombre,
        Apellido,
        Tipo_Doc,
        Doc_identificacion,
        Telefono,
        Correo,
        Clave: hashedPassword,
        Permiso,
        Genero,
        Edad,
        emailVerificationCode: codigoVerificacion,
        emailVerificationExpires: expiracion,
        emailVerified: false
      });

      const data = await user.save();

      // Enviar correo de verificación
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: Correo,
          subject: 'Código de verificación de correo',
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Verifica tu correo electrónico</h2>
            <p>Tu código de verificación es:</p>
            <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
              <strong>${codigoVerificacion}</strong>
            </div>
            <p>Este código expirará en 15 minutos.</p>
            <p>Si no solicitaste este registro, ignora este correo.</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>`
        });
      } catch (emailError) {
        // Si falla el envío, elimina el usuario creado
        await userSchema.findByIdAndDelete(data._id);
        return res.status(500).json({ message: 'Error al enviar el correo de verificación. Intenta nuevamente.' });
      }

      res.status(201).json({ message: 'Usuario registrado. Se envió un código de verificación a tu correo.', userId: data._id, correo: Correo });
    } catch (error) {
      handleError(res, error, "Error interno del servidor");
    }
  },
];

export const llamarUsuarios = async (req, res) => {
  try {
    const data = await userSchema.find().populate("Permiso");
    res.json(data);
  } catch (error) {
    handleError(res, error, "Error al obtener usuarios");
  }
};

export const llamarUsuId = [
  validatorHandler(getUserSchema, "params"),
  async (req, res) => {
    const { _id } = req.params;
    try {
      const user = await userSchema.findById(_id).populate("Permiso");
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(user);
    } catch (error) {
      handleError(res, error, "Error al obtener el usuario");
    }
  },
];

export const ActualizarUsu = [
  validatorHandler(getUserSchema, "params"),
  validatorHandler(updateUserSchema, "body"),
  async (req, res) => {
    const { _id } = req.params;
    const {
      Nombre,
      Apellido,
      Tipo_Doc,
      Doc_identificacion,
      Telefono,
      Correo,
      Clave,
      Permiso,
      Genero,
      Edad,
    } = req.body;
    if (!Permiso) {
      return res.status(400).json({ message: "El campo Permiso es obligatorio" });
    }

    try {
      const hashedPassword = Clave ? await bcrypt.hash(Clave, 10) : undefined;
      const updateData = {
        Nombre,
        Apellido,
        Tipo_Doc,
        Doc_identificacion,
        Telefono,
        Correo,
        Permiso,
        Genero,
        Edad,
      };

      if (hashedPassword) {
        updateData.Clave = hashedPassword;
      }

      const userUpdate = await userSchema.findByIdAndUpdate(
        _id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!userUpdate) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json({ message: "Usuario actualizado correctamente", data: userUpdate });
    } catch (error) {
      handleError(res, error, "Error al actualizar el usuario");
    }
  },
];

export const borrarUsu = [
  validatorHandler(deleteUserSchema, "params"),
  async (req, res) => {
    const { _id } = req.params;
    try {
      const result = await userSchema.findByIdAndDelete(_id);
      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      handleError(res, error, "Error al eliminar el usuario");
    }
  },
];

export const verificarCorreo = async (req, res) => {
  try {
    const { correo, codigo } = req.body;
    const usuario = await userSchema.findOne({ Correo: correo });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    if (usuario.emailVerified) {
      return res.status(400).json({ message: 'El correo ya está verificado.' });
    }
    if (!usuario.emailVerificationCode || !usuario.emailVerificationExpires) {
      return res.status(400).json({ message: 'No hay código de verificación pendiente.' });
    }
    if (usuario.emailVerificationExpires < Date.now()) {
      return res.status(400).json({ message: 'El código ha expirado. Solicita uno nuevo.' });
    }
    if (usuario.emailVerificationCode !== codigo) {
      return res.status(400).json({ message: 'Código incorrecto.' });
    }
    usuario.emailVerified = true;
    usuario.emailVerificationCode = null;
    usuario.emailVerificationExpires = null;
    await usuario.save();
    res.json({ message: 'Correo verificado correctamente.' });
  } catch (error) {
    handleError(res, error, 'Error al verificar el correo');
  }
};