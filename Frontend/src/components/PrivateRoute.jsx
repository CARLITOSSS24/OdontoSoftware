import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Spinner } from "react-bootstrap";

// roles: array de roles permitidos para la ruta
const PrivateRoute = ({ children, roles }) => {
  const { user, token, isLoading } = useContext(AuthContext);
  const location = useLocation();

  // Mostrar spinner mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  // Si no hay token o usuario, redirige al login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Obtiene el rol del usuario correctamente
  const userRol = typeof user.Permiso === "string" 
    ? user.Permiso 
    : user.Permiso?.rol || user.Permiso?.Rol || "";

  // Si hay restricción de roles y el usuario no tiene permiso, redirige a "no autorizado"
  if (roles && !roles.includes(userRol)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Si todo está bien, renderiza el componente hijo
  return children;
};

export default PrivateRoute;