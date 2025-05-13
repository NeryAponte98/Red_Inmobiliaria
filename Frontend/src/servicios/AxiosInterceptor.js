// Este servicio intercepta las peticiones HTTP para añadir el token JWT a los headers
import axios from 'axios';

// Función para configurar interceptores de axios
const setupAxiosInterceptors = () => {
  // Interceptor de peticiones
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      
      // Si existe un token, lo añadimos al header de la petición
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de respuestas para manejar errores de autenticación
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Si recibimos un error 401 Unauthorized, redirigimos al login
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Aquí podrías añadir una redirección al login si lo necesitas
        window.location.href = '/';
      }
      
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;