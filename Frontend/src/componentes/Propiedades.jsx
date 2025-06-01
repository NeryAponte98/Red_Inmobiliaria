import React, { useState, useEffect } from "react";
import { Search } from 'lucide-react';
import '../estilos/Propiedades.css'; // Importar el archivo CSS

const API_BASE = "http://localhost:8094/api/propiedades";

export default function GestionPropiedades() {
  // Estados
  const [propiedades, setPropiedades] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [operaciones, setOperaciones] = useState([]);
  const [estados, setEstados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [formTitulo, setFormTitulo] = useState("Nueva Propiedad");

  // Campos formulario
  const [formData, setFormData] = useState({
    idPropiedad: "",
    direccion: "",
    precio: "",
    tipo: "",
    operacion: "",
    estado: "",
    latitud: "",
    longitud: "",
  });

  // Cargar listas de select y propiedades al iniciar
  useEffect(() => {
    cargarOpciones();
    cargarPropiedades();
  }, []);

  // Funciones para cargar datos
  const cargarPropiedades = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setPropiedades(data);
    } catch (error) {
      console.error("Error cargando propiedades:", error);
    }
  };

  const cargarOpciones = async () => {
    try {
      const [tiposRes, opsRes, estadosRes] = await Promise.all([
        fetch(`${API_BASE}/tipos`),
        fetch(`${API_BASE}/operaciones`),
        fetch(`${API_BASE}/estados`),
      ]);
      const tiposData = await tiposRes.json();
      const opsData = await opsRes.json();
      const estadosData = await estadosRes.json();
      setTipos(tiposData);
      setOperaciones(opsData);
      setEstados(estadosData);
    } catch (error) {
      console.error("Error cargando opciones:", error);
    }
  };

  // Mostrar formulario para crear
  const mostrarFormulario = () => {
    setFormData({
      idPropiedad: "",
      direccion: "",
      precio: "",
      tipo: tipos.length ? tipos[0].idTipo : "",
      operacion: operaciones.length ? operaciones[0].idOperacion : "",
      estado: estados.length ? estados[0].idEstado : "",
      latitud: "",
      longitud: "",
    });
    setFormTitulo("Nueva Propiedad");
    setFormVisible(true);
  };

  // Manejar inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Función para obtener el ID del usuario logueado
  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || user.idUsuario || user.userId;
  };

  // Enviar formulario
  const submitFormulario = async (e) => {
    e.preventDefault();

    // Obtener el ID del usuario logueado
    const userId = getCurrentUserId();
    
    // Validar que tengamos un ID de usuario
    if (!userId) {
      alert('Error: No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    const propiedad = {
      direccion: formData.direccion,
      precio: parseFloat(formData.precio),
      tipo: { idTipo: parseInt(formData.tipo) },
      operacion: { idOperacion: parseInt(formData.operacion) },
      estado: { idEstado: parseInt(formData.estado) },
      latitud: parseFloat(formData.latitud),
      longitud: parseFloat(formData.longitud),
      idVendedor: parseInt(userId), // Usar el ID del usuario logueado
    };

    try {
      const method = formData.idPropiedad ? "PUT" : "POST";
      const url = formData.idPropiedad
        ? `${API_BASE}/${formData.idPropiedad}`
        : API_BASE;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propiedad),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error en la operación: ${errorText}`);
      }

      alert(
        formData.idPropiedad
          ? "Propiedad actualizada exitosamente"
          : "Propiedad creada exitosamente"
      );
      setFormVisible(false);
      cargarPropiedades();
    } catch (error) {
      console.error("Error en la operación:", error);
      alert(`Error al guardar propiedad: ${error.message}`);
    }
  };

  // Editar propiedad
  const editarPropiedad = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      const prop = await res.json();

      setFormData({
        idPropiedad: prop.idPropiedad,
        direccion: prop.direccion,
        precio: prop.precio,
        tipo: prop.tipo.idTipo,
        operacion: prop.operacion.idOperacion,
        estado: prop.estado.idEstado,
        latitud: prop.latitud,
        longitud: prop.longitud,
        // No incluimos idVendedor en el formulario
      });
      setFormTitulo("Editar Propiedad");
      setFormVisible(true);
    } catch (error) {
      console.error("Error al cargar propiedad:", error);
      alert("Error al cargar propiedad para editar");
    }
  };

  // Eliminar propiedad
  const eliminarPropiedad = async (id) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la propiedad con ID ${id}?`)) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar propiedad");
      alert("Propiedad eliminada");
      cargarPropiedades();
    } catch (error) {
      console.error("Error al eliminar propiedad:", error);
      alert("Error al eliminar propiedad");
    }
  };

  const propiedadesFiltradas = propiedades.filter((prop) => {
    const term = searchTerm.toLowerCase();
    return (
      prop.direccion.toLowerCase().includes(term) ||
      prop.tipo.nombreTipoPropiedad.toLowerCase().includes(term) ||
      prop.operacion.nombreOperacion.toLowerCase().includes(term)
    );
  });

  return (
    <div className="gestion-propiedades">
      <h1 className="main-title">Administración de Propiedades</h1>

      {/* Barra de búsqueda */}
      <div className="search-container">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por dirección, tipo de propiedad o operación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Botón crear propiedad */}
      <div className="action-bar">
        <button onClick={mostrarFormulario} className="btn-primary">
          Añadir Propiedad
        </button>
      </div>

      {/* Modal del formulario */}
      {formVisible && (
        <div 
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setFormVisible(false);
            }
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{formTitulo}</h2>
            </div>
            <div className="modal-body">
              <form onSubmit={submitFormulario}>
                <input type="hidden" id="idPropiedad" value={formData.idPropiedad} />

                <div className="form-group">
                  <label htmlFor="direccion" className="form-label">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    required
                    value={formData.direccion}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ingrese la dirección de la propiedad"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="precio" className="form-label">
                    Precio
                  </label>
                  <input
                    type="number"
                    id="precio"
                    required
                    value={formData.precio}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ingrese el precio"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tipo" className="form-label">
                    Tipo de Propiedad
                  </label>
                  <select
                    id="tipo"
                    required
                    value={formData.tipo}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {tipos.map((t) => (
                      <option key={t.idTipo} value={t.idTipo}>
                        {t.nombreTipoPropiedad}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="operacion" className="form-label">
                    Tipo de Operación
                  </label>
                  <select
                    id="operacion"
                    required
                    value={formData.operacion}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {operaciones.map((o) => (
                      <option key={o.idOperacion} value={o.idOperacion}>
                        {o.nombreOperacion}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="estado" className="form-label">
                    Estado
                  </label>
                  <select
                    id="estado"
                    required
                    value={formData.estado}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {estados.map((e) => (
                      <option key={e.idEstado} value={e.idEstado}>
                        {e.nombreEstadoPropiedad}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="latitud" className="form-label">
                    Latitud
                  </label>
                  <input
                    type="number"
                    id="latitud"
                    value={formData.latitud}
                    onChange={handleChange}
                    step="any"
                    className="form-input"
                    placeholder="Coordenada de latitud"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="longitud" className="form-label">
                    Longitud
                  </label>
                  <input
                    type="number"
                    id="longitud"
                    value={formData.longitud}
                    onChange={handleChange}
                    step="any"
                    className="form-input"
                    placeholder="Coordenada de longitud"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Guardar
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

      {/* Tabla de propiedades */}
      <div className="table-container">
        <table className="modern-table">
          <thead className="table-header">
            <tr>
              <th>Dirección</th>
              <th>Precio</th>
              <th>Tipo</th>
              <th>Operación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {propiedadesFiltradas.length > 0 ? (
              propiedadesFiltradas.map((p) => (
                <tr key={p.idPropiedad} className="table-row">
                  <td className="table-cell">{p.direccion}</td>
                  <td className="table-cell">
                    ${p.precio?.toLocaleString('es-CO')}
                  </td>
                  <td className="table-cell">{p.tipo?.nombreTipoPropiedad}</td>
                  <td className="table-cell">{p.operacion?.nombreOperacion}</td>
                  <td className="table-cell">{p.estado?.nombreEstadoPropiedad}</td>
                  <td className="table-cell">
                    <div className="action-buttons">
                      <button
                        onClick={() => editarPropiedad(p.idPropiedad)}
                        className="btn-edit"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarPropiedad(p.idPropiedad)}
                        className="btn-delete"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="table-cell">
                  <div className="empty-state">
                    <div className="empty-state-title">
                      No hay propiedades disponibles
                    </div>
                    <div className="empty-state-description">
                      {searchTerm 
                        ? "No se encontraron propiedades que coincidan con tu búsqueda"
                        : "Comienza agregando tu primera propiedad"
                      }
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}