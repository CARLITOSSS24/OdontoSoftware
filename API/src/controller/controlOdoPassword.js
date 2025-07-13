import Usuario from '../models/modelOdoUser.js';
import transporter from '../config/email.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { resetPasswordRequestSchema, resetPasswordSchema } from '../validators/validatorOdoPassword.js';

// Constantes para el sistema de restablecimiento
const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutos
const CODE_EXPIRATION = 15 * 60 * 1000; // 15 minutos

// Generar código aleatorio de 5 caracteres (letras y números)
function generarCodigo() {
  return crypto.randomBytes(4).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 5);
}

// Template HTML para el email
function generarEmailTemplate(codigo) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Restablecimiento de Contraseña</h2>
      <p>Has solicitado restablecer tu contraseña. Tu código de verificación es:</p>
      <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
        <strong>${codigo}</strong>
      </div>
      <p>Este código expirará en 15 minutos.</p>
      <p>Si no solicitaste este cambio, por favor ignora este correo y asegúrate de que tu cuenta esté segura.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
    </div>
  `;
}

export const solicitarCodigo = async (req, res) => {
  try {
    // Validar el esquema
    const { error } = resetPasswordRequestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ mensaje: error.details[0].message });
    }

    const { correo, documento } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ Correo: correo, Doc_identificacion: documento });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado con esos datos.' });
    }

    // Verificar si el usuario está bloqueado
    if (usuario.resetPasswordBlockedUntil && usuario.resetPasswordBlockedUntil > Date.now()) {
      const tiempoRestante = Math.ceil((usuario.resetPasswordBlockedUntil - Date.now()) / 60000);
      return res.status(429).json({ 
        mensaje: `Demasiados intentos. Por favor, espera ${tiempoRestante} minutos antes de intentar nuevamente.` 
      });
    }

    // Generar y guardar el código
    const codigo = generarCodigo();
    usuario.resetPasswordCode = codigo;
    usuario.resetPasswordExpires = Date.now() + CODE_EXPIRATION;
    usuario.resetPasswordAttempts = 0;
    await usuario.save();

    // Enviar correo
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: correo,
        subject: 'Código de verificación para restablecer contraseña',
        html: generarEmailTemplate(codigo)
      });
      res.json({ mensaje: 'Código enviado al correo.' });
    } catch (emailError) {
      console.error('Error al enviar el correo:', emailError);
      // Revertir los cambios si falla el envío del correo
      usuario.resetPasswordCode = null;
      usuario.resetPasswordExpires = null;
      await usuario.save();
      return res.status(500).json({ mensaje: 'Error al enviar el correo. Por favor, intenta nuevamente.' });
    }
  } catch (error) {
    console.error('Error en solicitarCodigo:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

export const verificarCodigo = async (req, res) => {
  try {
    const { correo, codigo } = req.body;
    const usuario = await Usuario.findOne({ Correo: correo });

    if (!usuario || !usuario.resetPasswordCode || !usuario.resetPasswordExpires) {
      return res.status(400).json({ mensaje: 'Solicitud inválida.' });
    }

    if (usuario.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ mensaje: 'El código ha expirado.' });
    }

    if (codigo.length !== 5) {
      return res.status(400).json({ mensaje: 'El código debe tener exactamente 5 caracteres.' });
    }

    if (usuario.resetPasswordCode !== codigo) {
      // Incrementar intentos fallidos
      usuario.resetPasswordAttempts = (usuario.resetPasswordAttempts || 0) + 1;
      
      // Si excede los intentos máximos, bloquear
      if (usuario.resetPasswordAttempts >= MAX_ATTEMPTS) {
        usuario.resetPasswordBlockedUntil = Date.now() + BLOCK_DURATION;
        await usuario.save();
        return res.status(429).json({ 
          mensaje: 'Demasiados intentos fallidos. Tu cuenta ha sido bloqueada temporalmente.' 
        });
      }

      await usuario.save();
      return res.status(400).json({ 
        mensaje: 'Código inválido.',
        intentosRestantes: MAX_ATTEMPTS - usuario.resetPasswordAttempts
      });
    }

    res.json({ mensaje: 'Código válido.' });
  } catch (error) {
    console.error('Error en verificarCodigo:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

export const restablecerPassword = async (req, res) => {
  try {
    // Validar el esquema
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ mensaje: error.details[0].message });
    }

    const { correo, codigo, nuevaClave } = req.body;
    const usuario = await Usuario.findOne({ Correo: correo });

    if (!usuario || !usuario.resetPasswordCode || !usuario.resetPasswordExpires) {
      return res.status(400).json({ mensaje: 'Solicitud inválida.' });
    }

    if (usuario.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ mensaje: 'El código ha expirado.' });
    }

    if (usuario.resetPasswordCode !== codigo) {
      return res.status(400).json({ mensaje: 'Código inválido.' });
    }

    // Actualizar contraseña y limpiar datos de reset
    usuario.Clave = await bcrypt.hash(nuevaClave, 10);
    usuario.resetPasswordCode = null;
    usuario.resetPasswordExpires = null;
    usuario.resetPasswordAttempts = 0;
    usuario.resetPasswordBlockedUntil = null;
    await usuario.save();

    // Enviar correo de confirmación
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: correo,
        subject: 'Contraseña actualizada exitosamente',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Contraseña Actualizada</h2>
            <p>Tu contraseña ha sido actualizada exitosamente.</p>
            <p>Si no realizaste este cambio, por favor contacta inmediatamente con soporte.</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Error al enviar el correo de confirmación:', emailError);
      // No retornamos error aquí ya que la contraseña ya fue actualizada
    }

    res.json({ mensaje: 'Contraseña restablecida correctamente.' });
  } catch (error) {
    console.error('Error en restablecerPassword:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

export const cancelarSolicitud = async (req, res) => {
  try {
    const { correo } = req.body;
    const usuario = await Usuario.findOne({ Correo: correo });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // Limpiar datos de reset
    usuario.resetPasswordCode = null;
    usuario.resetPasswordExpires = null;
    usuario.resetPasswordAttempts = 0;
    usuario.resetPasswordBlockedUntil = null;
    await usuario.save();

    res.json({ mensaje: 'Solicitud de restablecimiento cancelada.' });
  } catch (error) {
    console.error('Error en cancelarSolicitud:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}; 