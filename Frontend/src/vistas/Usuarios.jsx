import React, { useState, useEffect } from 'react';

const Usuarios = () => {
  // Estados para manejar la visibilidad del formulario de edición y el modal
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  
  // Datos de ejemplo (en una app real vendrían de props o una API)
  const [userData, setUserData] = useState({
    fullName: 'María González',
    email: 'maria@ejemplo.com',
    role: 'Usuario',
    joinedDate: '15/03/2023'
  });
  
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    fullName: userData.fullName,
    email: userData.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    deleteConfirmPassword: ''
  });
  
  // Actualizar formData cuando userData cambie
  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      fullName: userData.fullName,
      email: userData.email
    }));
  }, [userData]);

  // Manejadores de eventos
  const handleEditClick = () => {
    setIsEditFormVisible(true);
  };

  const handleCancelEdit = () => {
    // Restaurar los valores originales al cancelar
    setFormData(prevData => ({
      ...prevData,
      fullName: userData.fullName,
      email: userData.email
    }));
    setIsEditFormVisible(false);
  };
  
  const handleSaveProfile = () => {
    // Actualizar los datos del usuario con los valores del formulario
    setUserData(prevData => ({
      ...prevData,
      fullName: formData.fullName,
      email: formData.email
    }));
    setIsEditFormVisible(false);
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
  
  const handleConfirmDelete = () => {
    // Aquí iría la lógica para eliminar la cuenta
    console.log('Cuenta eliminada');
    setIsDeleteModalVisible(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handlePasswordChange = () => {
    // Aquí iría la lógica para cambiar la contraseña
    console.log('Contraseña cambiada');
    // Limpiar campos de contraseña
    setFormData(prevData => ({
      ...prevData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
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
            <h3>{userData.fullName}</h3>
            <p>{userData.email}</p>
            <p>
              <span>{userData.role}</span> · Miembro desde <span>{userData.joinedDate}</span>
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
                <div className="info-value">{userData.fullName}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Correo Electrónico:</div>
                <div className="info-value">{userData.email}</div>
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
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-email">Correo Electrónico:</label>
                <input 
                  type="email" 
                  id="edit-email" 
                  name="email"
                  value={formData.email}
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

export default Usuarios;