import jwt from 'jsonwebtoken';

// Middleware para rutas protegidas (requiere token)
export const verifyJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardar los datos del usuario en la solicitud
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token no válido' });
  }
};

// Middleware para verificar roles
export const verifyRole = (rolesPermitidos) => {
  return (req, res, next) => {
    const { Permiso } = req.user; // Asegúrate de que el middleware verifyJWT ya haya agregado req.user
    if (!rolesPermitidos.includes(Permiso)) {
      return res.status(403).json({ message: "Acceso denegado: no tienes el rol adecuado" });
    }
    next();
  };
};

// Nuevo middleware: permite acceso público a ciertas rutas
export const allowPublic = (req, res, next) => {
  // Simplemente pasa al siguiente middleware, sin requerir autenticación
  next();
};