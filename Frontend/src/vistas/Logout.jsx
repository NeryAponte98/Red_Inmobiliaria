// src/vistas/Logout.js
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../servicios/AuthServices';

const Logout = () => {
  useEffect(() => {
    // Cerrar sesión al montar el componente
    AuthService.logout();
  }, []);

  // Redirigir automáticamente al login
  return <Navigate to="/login" replace />;
};

export default Logout;