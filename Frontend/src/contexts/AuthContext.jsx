import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicialización del estado
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
          const decoded = jwtDecode(savedToken);
          if (decoded.exp * 1000 > Date.now()) {
            setToken(savedToken);
            setUser(decoded);
          } else {
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Error al inicializar auth:", error);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Guardar token y usuario al hacer login
  const login = (jwt) => {
    try {
      setIsLoading(true);
      const decoded = jwtDecode(jwt);
      if (decoded.exp * 1000 > Date.now()) {
        localStorage.setItem("token", jwt);
        setToken(jwt);
        setUser(decoded);
      } else {
        throw new Error("Token expirado");
      }
    } catch (error) {
      console.error("Error al procesar el token:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar token y usuario al hacer logout
  const logout = () => {
    setIsLoading(true);
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsLoading(false);
  };

  // Verificar expiración del token cada minuto
  useEffect(() => {
    if (token) {
      const checkToken = () => {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 <= Date.now()) {
            logout();
          }
        } catch (error) {
          console.error("Error al verificar token:", error);
          logout();
        }
      };

      const interval = setInterval(checkToken, 60000);
      return () => clearInterval(interval);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};