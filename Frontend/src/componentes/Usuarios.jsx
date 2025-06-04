import React, { useEffect, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import '../estilos/Usuarios.css';
import {
  cargarTodosUsuarios,
  actualizarDatosUsuario,
  eliminarUsuarioComoAdmin,
  registrarNuevoUsuario
} from '../servicios/UsuarioServices';

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [formTitulo, setFormTitulo] = useState('Editar Usuario');
  const [modoFormulario, setModoFormulario] = useState('editar');
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    nombreUsuario: '',
    email: '',
    password: '',
    tipoUsuario: '',
    tipoUsuarioId: ''
  });

  const cargarTiposUsuario = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8094/api/tipos-usuario`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        const tipos = await response.json();
        setTiposUsuario(tipos);
      }
    } catch (error) {
      console.error("Error al cargar tipos de usuario:", error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const data = await cargarTodosUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      alert("No se pudieron cargar los usuarios");
    }
  };

  useEffect(() => {
    cargarUsuarios();
    cargarTiposUsuario();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const limpiarFormulario = () => {
    setFormData({
      id: '',
      nombreUsuario: '',
      email: '',
      password: '',
      tipoUsuario: '',
      tipoUsuarioId: ''
    });
  };

  // CORREGIDO: Función separada para crear usuario
  const mostrarFormularioCrear = () => {
    limpiarFormulario(); // Limpiar el formulario
    setModoFormulario('crear');
    setFormTitulo('Crear Nuevo Usuario');
    setFormVisible(true);
  };

  const mostrarFormularioEditar = (usuario) => {
    setFormData({
      id: usuario.id,
      nombreUsuario: usuario.nombre_usuario,
      email: usuario.email_usuario,
      password: '',
      tipoUsuario: usuario.id_tipo_usuario,
      tipoUsuarioId: usuario.id_tipo_usuario?.id || ''
    });
    setModoFormulario('editar');
    setFormTitulo('Editar Usuario');
    setFormVisible(true);
  };

  // CORREGIDO: Función mejorada para crear usuario con mejor manejo de errores
  const crearUsuario = async () => {
    try {
      if (!formData.nombreUsuario || !formData.email || !formData.password || !formData.tipoUsuarioId) {
        alert("Todos los campos son obligatorios");
        return;
      }

      if (formData.password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      const datosUsuario = {
        nombreUsuario: formData.nombreUsuario,
        email: formData.email,
        password: formData.password,
        tipoUsuarioId: parseInt(formData.tipoUsuarioId)
      };

      console.log("Enviando datos:", datosUsuario); // Para debug

      const resultado = await registrarNuevoUsuario(datosUsuario);
      
      console.log("Usuario creado:", resultado); // Para debug
      alert("Usuario registrado exitosamente");
      setFormVisible(false);
      limpiarFormulario();
      cargarUsuarios();
    } catch (error) {
      console.error("Error completo:", error);
      alert(error.message || "Error al crear el usuario");
    }
  };

  const editarUsuario = async () => {
    try {
      await actualizarDatosUsuario(formData.id, {
        nombreUsuario: formData.nombreUsuario,
        email: formData.email
      });
      alert("Usuario actualizado exitosamente");
      setFormVisible(false);
      cargarUsuarios();
    } catch (error) {
      alert(error.message);
    }
  };

  const eliminarUsuario = async () => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar al usuario "${formData.nombreUsuario}"? Esta acción no se puede deshacer.`
    );
    
    if (!confirmar) return;

    try {
      await eliminarUsuarioComoAdmin(formData.id);
      alert("Usuario eliminado exitosamente");
      setFormVisible(false);
      cargarUsuarios();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modoFormulario === 'crear') {
      crearUsuario();
    } else {
      editarUsuario();
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const term = searchTerm.toLowerCase();
    const nombre = u.nombre_usuario || '';
    const correo = u.email_usuario || '';
    return (
      nombre.toLowerCase().includes(term) ||
      correo.toLowerCase().includes(term)
    );
  });

  return (
    <div className="gestion-usuarios">
      <div className="header-section">
        <h1 className="main-title">Gestión de Usuarios</h1>
      </div>

      <div className="search-container">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <button 
        className="btn-primary"
        onClick={mostrarFormularioCrear}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Plus size={20} />
        Crear Usuario
      </button>

      <div className="table-container">
        <table className="modern-table">
          <thead className="table-header">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id} className="table-row">
                <td>{usuario.id}</td>
                <td>{usuario.nombre_usuario}</td>
                <td>{usuario.email_usuario}</td>
                <td>{usuario.id_tipo_usuario?.nombre_tipo_usuario}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => mostrarFormularioEditar(usuario)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{formTitulo}</h2>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nombreUsuario" className="form-label">
                    Nombre de Usuario *
                  </label>
                  <input
                    type="text"
                    id="nombreUsuario"
                    value={formData.nombreUsuario}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                {modoFormulario === 'crear' && (
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Mínimo 6 caracteres"
                      required
                    />
                  </div>
                )}

                {modoFormulario === 'crear' && (
                  <div className="form-group">
                    <label htmlFor="tipoUsuarioId" className="form-label">
                      Tipo de Usuario *
                    </label>
                    <select
                      id="tipoUsuarioId"
                      value={formData.tipoUsuarioId}
                      onChange={handleChange}
                      className="form-input"
                      required
                    >
                      <option value="">Seleccionar tipo...</option>
                      <option value="1">Administrador</option>
                      <option value="2">Vendedor</option>
                      
                    </select>
                  </div>
                )}

                {modoFormulario === 'editar' && (
                  <div className="form-group">
                    <label className="form-label">Tipo de Usuario</label>
                    <input
                      type="text"
                      value={formData.tipoUsuario?.nombre_tipo_usuario || ''}
                      disabled
                      className="form-input"
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                  </div>
                )}

                <div className="form-actions">
                  {modoFormulario === 'crear' && (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={crearUsuario}
                    >
                      Crear Usuario
                    </button>
                  )}
                  
                  {modoFormulario === 'editar' && (
                    <>
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={eliminarUsuario}
                      >
                        Eliminar Usuario
                      </button>
                    </>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => {
                      setFormVisible(false);
                      limpiarFormulario();
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}