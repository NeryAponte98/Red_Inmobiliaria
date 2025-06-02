// usuarioServices.js - Lógica de autenticación y servicios de usuario

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // Retorna true si el token existe
};

// Función para decodificar JWT
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// Función para cerrar sesión
export const logout = () => {
  localStorage.removeItem("token");
};

// API para cargar datos del usuario
export const cargarDatosUsuario = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8094/api/usuario/list/${userId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Error al cargar los datos del usuario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    throw error;
  }
};

export const cargarTodosUsuarios = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8094/api/usuario/list`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Error al cargar los datos del usuario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    throw error;
  }
};


// API para actualizar datos del usuario
export const actualizarDatosUsuario = async (userId, datosActualizados) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8094/api/usuario/${userId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosActualizados)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar los datos del usuario");
    }

    const data = await response.json();
    
    // Si se proporciona un nuevo token, actualizarlo en localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    throw error;
  }
};

// API para cambiar contraseña
export const cambiarContraseñaUsuario = async (userId, currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem("token");
    const nuevoPassword = {
      password: currentPassword,
      newPassword: newPassword
    };

    const response = await fetch(`http://localhost:8094/api/usuario/${userId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevoPassword)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al cambiar la contraseña");
    }

    return true;
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    throw error;
  }
};

// API para eliminar cuenta
export const eliminarCuentaUsuario = async (userId, password) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8094/api/usuario/${userId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar la cuenta");
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar la cuenta:", error);
    throw error;
  }
};