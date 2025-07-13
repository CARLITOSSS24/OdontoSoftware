import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para adjuntar el token en cada petición
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error en la petición:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar expiración o invalidez del token
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, config } = error.response;
      
      // Solo manejar errores de autenticación
      if (status === 401 || status === 403) {
        // No redirigir si ya estamos en login o si es una petición de login
        const isLoginPage = window.location.pathname === '/login';
        const isLoginRequest = config.url.includes('/login');
        
        if (!isLoginPage && !isLoginRequest) {
          // Limpiar el token solo si no estamos en login
          localStorage.removeItem("token");
          
          // Usar window.location.href para una redirección completa
          window.location.href = "/login";
        }
      }
      
      // Log del error para debugging
      console.error("Error en la respuesta:", {
        status: error.response.status,
        data: error.response.data,
        url: config.url,
        pathname: window.location.pathname
      });
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error("Error de conexión:", {
        message: "No se pudo conectar con el servidor",
        url: error.config?.url,
        method: error.config?.method
      });
    } else {
      // Error al configurar la petición
      console.error("Error en la configuración:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance;