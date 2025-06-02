// AuthService.js
import axios from 'axios';

// URL base de autenticación
const API_URL = 'http://localhost:8094/api/auth';

// Decodificar token JWT
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// Verificar si el token está expirado
export const isTokenExpired = (token) => {
  const decoded = parseJwt(token);
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 < Date.now(); // Convertir a milisegundos
};

class AuthService {
  // Iniciar sesión
  async login(nombreUsuario, password) {
    const response = await axios.post(`${API_URL}/login`, {
      nombreUsuario,
      password
    });

    const token = response.data.token;
    if (token) {
      const decoded = parseJwt(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        id: decoded.id,
        nombreUsuario: decoded.sub,
        tipoUsuario: decoded.tipoUsuario,
        tipoUsuarioId: decoded.tipoUsuarioId
      }));
    }

    return response.data;
  }

  // Registrar nuevo usuario
  register(nombreUsuario, email, password, tipoUsuarioId) {
    return axios.post(`${API_URL}/register`, {
      nombreUsuario,
      email,
      password,
      tipoUsuarioId
    });
  }

  // Cerrar sesión
  logout() {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Obtener token JWT
  getToken() {
    return localStorage.getItem('token');
  }

  // Obtener datos del usuario
  getUser() {
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error al parsear usuario:', error);
      return null;
    }
  }

  // Verificar si el usuario está autenticado y el token está vigente
  isAuthenticated() {
    const token = this.getToken();
    return token && !isTokenExpired(token);
  }

  // Obtener propiedades individuales
  getUserId() {
    const user = this.getUser();
    return user?.id || null;
  }

  getUsername() {
    const user = this.getUser();
    return user?.nombreUsuario || null;
  }

  getUserRole() {
    const user = this.getUser();
    return user?.tipoUsuario || null; // Ej: "Administrador", "Cliente"
  }

  getUserRoleId() {
    const user = this.getUser();
    return user?.tipoUsuarioId || null; // Ej: 1, 2, 3
  }

  // Validaciones por rol
  hasRole(role) {
    return this.getUserRole() === role;
  }

  hasAnyRole(roles) {
    const userRole = this.getUserRole();
    return Array.isArray(roles) ? roles.includes(userRole) : false;
  }

  isAdmin() {
    return this.hasRole('Administrador');
  }

  isVendedor() {
    return this.hasRole('Vendedor');
  }

  isCliente() {
    return this.hasRole('Cliente');
  }
}

export default new AuthService();
