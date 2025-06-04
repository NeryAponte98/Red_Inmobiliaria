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

export const eliminarUsuarioComoAdmin = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8094/api/usuario/admin/${userId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar el usuario");
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar usuario como admin:", error);
    throw error;
  }
};

// Agregar esta función a tu archivo usuarioServices.js

export const registrarNuevoUsuario = async (datosUsuario) => {
  const token = localStorage.getItem("token");

  try {
    console.log("Enviando datos al servidor:", datosUsuario); // Debug

    const response = await fetch(`http://localhost:8094/api/auth/register`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosUsuario)
    });

    console.log("Status de respuesta:", response.status); // Debug
    console.log("Headers de respuesta:", response.headers.get('content-type')); // Debug

    // Verificar si la respuesta es JSON válido
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = "No se pudo registrar el usuario.";
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.error("Error al parsear JSON de error:", jsonError);
        }
      } else {
        // Si no es JSON, obtener el texto plano
        const errorText = await response.text();
        console.error("Respuesta de error (no JSON):", errorText);
        errorMessage = `Error del servidor (${response.status}): ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }

    // Verificar si la respuesta exitosa es JSON
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Si no es JSON, devolver un objeto de éxito
      const responseText = await response.text();
      console.log("Respuesta exitosa (no JSON):", responseText);
      return { success: true, message: "Usuario registrado correctamente" };
    }

  } catch (error) {
    console.error("Error completo en registrarNuevoUsuario:", error);
    
    // Si es un error de red o parsing
    if (error.name === 'TypeError' || error.message.includes('JSON')) {
      throw new Error("Error de conexión con el servidor. Verifica tu conexión.");
    }
    
    throw error;
  }
};


