import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../estilos/usuarios.css';
import { 
  isAuthenticated, 
  parseJwt, 
  logout,
  cargarDatosUsuario,
  actualizarDatosUsuario,
  cambiarContraseñaUsuario,
  eliminarCuentaUsuario
} from '../servicios/UsuarioServices.js';

const Usuario = () => {
  const navigate = useNavigate();
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  
  // Estado para almacenar los datos del usuario
  const [userData, setUserData] = useState({
    nombre_usuario: '',
    email_usuario: '',
    tipo_usuario: '',
    id_usuario: null
  });
  
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    email_usuario: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    deleteConfirmPassword: ''
  });
  
  // Verificar autenticación al cargar el componente
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/usuarios');
      return;
    }

    const token = localStorage.getItem("token");
    const decodedToken = parseJwt(token);
    const userId = decodedToken ? decodedToken.id : null;
    const tipoUser = decodedToken ? decodedToken.sub : null;

    if (!userId) {
      console.error("No se pudo obtener el ID del usuario.");
      return;
    }

    // Verificar tipo de usuario para acceso a propiedades
    if (tipoUser === "Cliente") {
      // Aquí podrías manejar restricciones de UI basadas en tipo de usuario
    }

    // Cargar datos del usuario
    const fetchUserData = async () => {
      try {
        const usuario = await cargarDatosUsuario(userId);
        
        setUserData({
          nombre_usuario: usuario.nombre_usuario,
          email_usuario: usuario.email_usuario,
          tipo_usuario: usuario.id_tipo_usuario.nombre_tipo_usuario,
          id_usuario: userId
        });
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Actualizar formData cuando userData cambie
  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      nombre_usuario: userData.nombre_usuario,
      email_usuario: userData.email_usuario
    }));
  }, [userData]);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // MANEJADORES DE EVENTOS PARA LA UI
  const handleEditClick = () => {
    setIsEditFormVisible(true);
  };

  const handleCancelEdit = () => {
    // Restaurar valores originales al cancelar
    setFormData(prevData => ({
      ...prevData,
      nombre_usuario: userData.nombre_usuario,
      email_usuario: userData.email_usuario
    }));
    setIsEditFormVisible(false);
  };
  
  const handleSaveProfile = async () => {
    try {
      const { nombre_usuario, email_usuario } = formData;
      const userId = userData.id_usuario;
      
      const usuarioActualizado = {};
      if (nombre_usuario.trim() !== "") {
        usuarioActualizado.nombre_usuario = nombre_usuario;
      }
      if (email_usuario.trim() !== "") {
        usuarioActualizado.email_usuario = email_usuario;
      }

      const data = await actualizarDatosUsuario(userId, usuarioActualizado);
      alert("Perfil actualizado correctamente");
      setIsEditFormVisible(false);
      
      // Recargar datos del usuario
      const usuario = await cargarDatosUsuario(userId);
      setUserData({
        nombre_usuario: usuario.nombre_usuario,
        email_usuario: usuario.email_usuario,
        tipo_usuario: usuario.id_tipo_usuario.nombre_tipo_usuario,
        id_usuario: userId
      });
    } catch (error) {
      alert("Error al actualizar el perfil: " + error.message);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const { currentPassword, newPassword, confirmPassword } = formData;
      const userId = userData.id_usuario;

      if (newPassword !== confirmPassword) {
        alert("Las contraseñas nuevas no coinciden.");
        return;
      }

      await cambiarContraseñaUsuario(userId, currentPassword, newPassword);
      alert("Contraseña actualizada correctamente.");
      
      // Limpiar campos de contraseña
      setFormData(prevData => ({
        ...prevData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      alert("Error al cambiar la contraseña: " + error.message);
    }
  };

  const handleDeleteAccountClick = () => {
    setIsDeleteModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalVisible(false);
    // Limpiar contraseña de confirmación
    setFormData(prevData => ({
      ...prevData,
      deleteConfirmPassword: ''
    }));
  };
  
  const handleConfirmDelete = async () => {
    try {
      const { deleteConfirmPassword } = formData;
      const userId = userData.id_usuario;
      
      await eliminarCuentaUsuario(userId, deleteConfirmPassword);
      alert("La cuenta ha sido eliminada");
      logout();
      navigate('/login');
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h2>Mi Perfil</h2>
        <p>Gestiona tu información personal y preferencias de cuenta</p>
      </div>

      <div className="profile-container">
        <div className="profile-section user-profile-header">
          <div className="profile-avatar">
            <i className="bi bi-person-circle"></i>
          </div>

          <div className="profile-header-info">
            <h3>{userData.nombre_usuario}</h3>
            <p>{userData.email_usuario}</p>
            <p>
              <span>{userData.tipo_usuario}</span>
            </p>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h3><i className="bi bi-person"></i> Información Personal</h3>
            <button onClick={handleEditClick} className="btn-secondary">
              <i className="bi bi-pencil-square"></i> Editar
            </button>
          </div>
          
          {/* Vista de información (mostrar cuando no se está editando) */}
          {!isEditFormVisible && (
            <div className="profile-info">
              <div className="info-row">
                <div className="info-label">Nombre Completo:</div>
                <div className="info-value">{userData.nombre_usuario}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Correo Electrónico:</div>
                <div className="info-value">{userData.email_usuario}</div>
              </div>
            </div>
          )}
          
          {/* Formulario de edición (mostrar cuando se está editando) */}
          {isEditFormVisible && (
            <div className="profile-form">
              <div className="form-group">
                <label htmlFor="edit-fullname">Nombre Completo:</label>
                <input 
                  type="text" 
                  id="edit-fullname" 
                  name="nombre_usuario"
                  value={formData.nombre_usuario}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-email">Correo Electrónico:</label>
                <input 
                  type="email" 
                  id="edit-email" 
                  name="email_usuario"
                  value={formData.email_usuario}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button onClick={handleSaveProfile} className="btn-primary">Guardar Cambios</button>
                <button onClick={handleCancelEdit} className="btn-secondary">Cancelar</button>
              </div>
            </div>
          )}
        </div>

        {/* Cambio de contraseña */}
        <div className="profile-section">
          <div className="section-header">
            <h3><i className="bi bi-lock-fill"></i> Seguridad de la cuenta</h3>
          </div>
          <div className="profile-form">
            <div className="form-group">
              <label htmlFor="current-password">Contraseña Actual:</label>
              <input 
                type="password" 
                id="current-password" 
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">Nueva Contraseña:</label>
              <input 
                type="password" 
                id="new-password" 
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirmar Contraseña:</label>
              <input 
                type="password" 
                id="confirm-password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-actions">
              <button onClick={handlePasswordChange} className="btn-primary">Cambiar Contraseña</button>
            </div>
          </div>
        </div>

        {/* Eliminar cuenta */}
        <div className="profile-section danger-zone">
          <div className="section-header">
            <h3><i className="fas fa-exclamation-triangle"></i> Zona de Peligro</h3>
          </div>
          <div className="danger-content">
            <p>
              Eliminar tu cuenta es una acción permanente y no se puede deshacer.
              Toda tu información y datos asociados serán eliminados.
            </p>
            <button 
              onClick={handleDeleteAccountClick} 
              className="btn-danger"
            >
              Eliminar mi Cuenta
            </button>
          </div>
        </div>
      </div>

      {/* Modal para eliminar cuenta */}
      {isDeleteModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3><i className="fas fa-exclamation-triangle"></i> Eliminar Cuenta</h3>
              <button onClick={handleCloseModal} className="close-modal">&times;</button>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar tu cuenta? 
                Esta acción no se puede deshacer y toda tu información será eliminada permanentemente.
              </p>
              <div className="form-group">
                <label htmlFor="delete-confirm-password">
                  Ingresa tu contraseña para confirmar:
                </label>
                <input 
                  type="password" 
                  id="delete-confirm-password"
                  name="deleteConfirmPassword"
                  value={formData.deleteConfirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button onClick={handleConfirmDelete} className="btn-danger">Sí, Eliminar mi Cuenta</button>
              <button onClick={handleCloseModal} className="btn-secondary">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuario;