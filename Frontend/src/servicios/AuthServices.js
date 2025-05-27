// Este servicio maneja la autenticación y almacenamiento del token JWT
import axios from 'axios';

const API_URL = 'http://localhost:8094/api/auth';

class AuthService {
  // Método para iniciar sesión
  login(nombreUsuario, password) {
    return axios
      .post(`${API_URL}/login`, {
        nombreUsuario,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify({
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            role: response.data.role
          }));
        }
        return response.data;
      });
  }

  // Método para cerrar sesión
  logout() {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Token después de logout:', localStorage.getItem('token'));
  }

  // Método para registrar un nuevo usuario
  register(nombreUsuario, email, password, tipoUsuarioId) {
    return axios.post(`${API_URL}/register`, {
      nombreUsuario,
      email,
      password,
      tipoUsuarioId
    });
  }

  // Obtener el token JWT almacenado
  getToken() {
    return localStorage.getItem('token');
  }

  // Obtener el usuario actual
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = this.getToken();
    return !!token; // Devuelve true si existe un token
  }
}

export default new AuthService();