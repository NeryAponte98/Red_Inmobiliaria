import axios from 'axios';

// Configuración de API base URL - ajusta según tu configuración
const API_URL = "http://localhost:8094/api";

class AuthService {
  login(nombreUsuario, password) {
    return axios
      .post(API_URL + "/auth/login", {
        nombreUsuario,   
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(userData) {
    return axios.post(API_URL + "/auth/register", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user && !!user.token;
  }

  getToken() {
    const user = this.getCurrentUser();
    return user?.token;
  }

  hasRole(requiredRole) {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;
    
    return user.roles.some(role => 
      role.toLowerCase() === requiredRole.toLowerCase()
    );
  }
}

export default new AuthService();