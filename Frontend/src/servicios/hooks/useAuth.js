// hooks/useAuth.js
import { useState, useEffect } from 'react';
import AuthService from '../servicios/AuthServices';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = AuthService.getUser();
    setUser(userData);
    setLoading(false);
  }, []);

  return {
    // Datos del usuario
    user,
    loading,
    isAuthenticated: AuthService.isAuthenticated(),
    
    // Verificaciones de rol
    isCliente: AuthService.isCliente(),
    isAdmin: AuthService.isAdmin(),
    isVendedor: AuthService.isVendedor(),
    
    // Funciones de utilidad
    hasRole: (role) => AuthService.hasRole(role),
    hasAnyRole: (roles) => AuthService.hasAnyRole(roles),
    canAccess: (allowedRoles) => AuthService.hasAnyRole(allowedRoles),
    
    // Información del usuario
    userId: user?.id,
    username: user?.nombreUsuario,
    email: user?.email,
    role: user?.rol
  };
};