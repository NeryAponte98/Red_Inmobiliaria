import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import '../estilos/Usuarios.css';
import {
  cargarTodosUsuarios,
  actualizarDatosUsuario,
  eliminarCuentaUsuario
} from '../servicios/UsuarioServices';
import { parseJwt } from '../servicios/AuthServices';

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [formTitulo, setFormTitulo] = useState('Editar Usuario');
  const [formData, setFormData] = useState({
    id: '',
    nombreUsuario: '',
    email: '',
    tipoUsuario: ''
  });

  const cargarUsuarios = async () => {
    try {
      const data = await cargarTodosUsuarios();
      console.log("🔍 Usuarios cargados:", data);
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      alert("No se pudieron cargar los usuarios");
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const editarUsuario = async () => {
    try {
      const res = await actualizarDatosUsuario(formData.id, {
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
    const password = prompt("Para confirmar, ingresa tu contraseña actual:");
    if (!password) return;

    try {
      await eliminarCuentaUsuario(formData.id, password);
      alert("Cuenta eliminada exitosamente");
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      alert(error.message);
    }
  };

  const mostrarFormulario = (usuario) => {
    setFormData({
      id: usuario.id,
      nombreUsuario: usuario.nombre_usuario,
      email: usuario.email_usuario,
      tipoUsuario: usuario.id_tipo_usuario
    });
    setFormVisible(true);
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
      <h1 className="main-title">Gestión de Usuarios</h1>

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
                    onClick={() => mostrarFormulario(usuario)}
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  editarUsuario();
                }}
              >
                <div className="form-group">
                  <label htmlFor="nombreUsuario" className="form-label">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    id="nombreUsuario"
                    value={formData.nombreUsuario}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo de Usuario</label>
                  <input
                    type="text"
                    value={formData.tipoUsuario?.nombre_tipo_usuario || ''}
                    disabled
                    className="form-input"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={eliminarUsuario}
                  >
                    Eliminar Cuenta
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormVisible(false)}
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
