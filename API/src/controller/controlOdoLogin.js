import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import mongoose from 'mongoose';
import userSchema from '../models/modelOdoUser.js';
import doctoraSchema from '../models/modelOdoDoctora.js';
import permisosSchema from '../models/modelOdoPermisos.js';  
import { loginSchema } from '../validators/validatorOdoLogin.js';
import Usuario from '../models/modelOdoUser.js';
import crypto from 'crypto';
import { validationResult } from 'express-validator';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const Login = async (req, res) => {
  try {
    const { Correo, Clave } = req.body;

    // Validar el esquema de login
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Buscar primero en usuarios
    let user = await userSchema.findOne({ Correo }).populate('Permiso');
    let isDoctora = false;

    // Si no existe en usuarios, buscar en doctoras
    if (!user) {
      user = await doctoraSchema.findOne({ Correo }).populate('Permiso');
      isDoctora = true;
    }
    if (!user) {
      return res.status(400).json({ message: "Correo o clave incorrectos." });
    }

    // Logs de depuración para el login
    console.log('Intentando login para:', Correo);
    console.log('Clave enviada:', Clave);
    console.log('Clave almacenada:', user.Clave);
    const isMatch = await bcrypt.compare(Clave, user.Clave);
    console.log('¿Coincide la clave?', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Correo o clave incorrectos." });
    }

    // Generar el token
    const token = jwt.sign(
      {
        id: user._id,
        Correo: user.Correo,
        Nombre: isDoctora ? user.Nombres : user.Nombre,
        Permiso: user.Permiso.rol
      },
      JWT_SECRET,
      { expiresIn: '6h' }
    );

    return res.status(200).json({ 
      message: "Inicio de sesión exitoso", 
      token 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor." });
  }
};

export default Login;

