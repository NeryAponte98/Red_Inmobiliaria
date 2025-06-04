import React, { useState, useEffect } from "react";
import { Search } from 'lucide-react';
import '../estilos/Propiedades.css';

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
  const [imagen, setImagen] = useState(null);
  const [imagenesExistentes, setImagenesExistentes] = useState([]);

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
    setImagenesExistentes([]);
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

    // Validar que haya imagen
    if (!imagen && !formData.idPropiedad) {
      alert("Por favor selecciona una imagen principal para la propiedad.");
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

      let idPropiedad = formData.idPropiedad;
      if (!idPropiedad) {
        const data = await res.json();
        idPropiedad = data.idPropiedad;
      }

      if (imagen && idPropiedad) {
        let huboErrorImagen = false;
        for (let i = 0; i < imagen.length; i++) {
          const formDataImg = new FormData();
          formDataImg.append("id_propiedad", idPropiedad);
          formDataImg.append("file", imagen[i]);

          const resImg = await fetch("http://localhost:8094/api/imagenPropiedad/upload", {
            method: "POST",
            body: formDataImg,
          });

          if (!resImg.ok) {
            huboErrorImagen = true;
          }
        }

        if (huboErrorImagen) {
          alert("Propiedad creada/actualizada, pero hubo un problema subiendo una o más imágenes.");
        }
      }

      alert(
        formData.idPropiedad
          ? "Propiedad actualizada exitosamente"
          : "Propiedad creada exitosamente"
      );
      setFormVisible(false);
      cargarPropiedades();
      setImagen(null);
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
      // Cargar imágenes existentes para la propiedad al editar
      const resImg = await fetch(`http://localhost:8094/api/imagenPropiedad/propiedad/${id}`);
      const dataImg = await resImg.json();
      setImagenesExistentes(Array.isArray(dataImg) ? dataImg : []);
      setFormTitulo("Editar Propiedad");
      setFormVisible(true);
    } catch (error) {
      console.error("Error al cargar propiedad:", error);
      alert("Error al cargar propiedad para editar");
    }
  };

  function CarruselImagenesEdicion({ imagenes, onEliminar }) {
    const [index, setIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState(0); // -1: izquierda, 1: derecha
  
    if (!imagenes || imagenes.length === 0) return null;
  
    const siguiente = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDirection(1);
      setAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % imagenes.length);
        setAnimating(false);
      }, 300);
    };
    const anterior = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDirection(-1);
      setAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
        setAnimating(false);
      }, 300);
    };
  
    return (
      <div style={{ width: 220, margin: "0 auto 20px auto", position: "relative", overflow: "hidden", height: 150 }}>
        {/* Flecha izquierda */}
        <button
          type="button"
          onClick={anterior}
          disabled={imagenes.length === 1}
          style={{
            position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
            zIndex: 2, background: "#c15628", color: "#fff", border: "none", borderRadius: "50%",
            width: 28, height: 28, fontSize: 18, cursor: "pointer", opacity: 0.9
          }}
        >&lt;</button>
        {/* Imagen con animación */}
        <div
          className={`carrusel-img-wrapper${animating ? " animating" : ""}`}
          style={{
            width: 200, height: 130, borderRadius: 10, margin: "0 auto", overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={imagenes[index].urlImagen?.startsWith('http') ? imagenes[index].urlImagen : `http://localhost:8094${imagenes[index].urlImagen}`}
            alt=""
            className="propiedad-imagen"
            style={{
              width: "100%", height: "100%", borderRadius: 10, objectFit: "cover",
              position: "absolute",
              left: 0,
              top: 0,
              transition: animating ? "transform 0.3s cubic-bezier(.55,0,.1,1)" : "none",
              transform: animating
                ? `translateX(${direction * -100}%)`
                : "translateX(0)",
              zIndex: 1,
            }}
          />
        </div>
        {/* Botón eliminar */}
        <button
          type="button"
          onClick={() => onEliminar(imagenes[index].idImagen)}
          style={{
            position: "absolute", top: 8, right: 6, background: "rgba(220,53,69,0.85)",
            color: "white", border: "none", borderRadius: "50%", width: 28, height: 28, fontSize: 18, cursor: "pointer", zIndex: 3
          }}
          title="Eliminar imagen"
        >x</button>
        {/* Flecha derecha */}
        <button
          type="button"
          onClick={siguiente}
          disabled={imagenes.length === 1}
          style={{
            position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
            zIndex: 2, background: "#c15628", color: "#fff", border: "none", borderRadius: "50%",
            width: 28, height: 28, fontSize: 18, cursor: "pointer", opacity: 0.9
          }}
        >&gt;</button>
        {/* Indicador */}
        <div style={{ marginTop: 6, color: "#c15628", textAlign: "center" }}>{index + 1} / {imagenes.length}</div>
      </div>
    );
  }

  // Función para eliminar imagen existente
  const eliminarImagenExistente = async (idImagen) => {
    console.log("Eliminando imagen con id:", idImagen);
    if (!window.confirm("¿Eliminar esta imagen?")) return;
    const res = await fetch(`http://localhost:8094/api/imagenPropiedad/${idImagen}`, { method: "DELETE" });
    if (res.ok) {
      setImagenesExistentes(imagenesExistentes.filter(img => img.idImagen !== idImagen));
    } else {
      const mensaje = await res.text();
      console.log("Error al eliminar la imagen" + mensaje);

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
                
                <div className="form-group">
                  <label htmlFor="Imagen" className="form-label">
                    Imagen
                  </label>
                  <input
                    type="file"
                    id="imagenPrincipal"
                    accept="image/*"
                    multiple
                    required={!formData.idPropiedad}  // Solo requerido al crear
                    onChange={(e) => setImagen(e.target.files)}
                    className="form-input"
                  />
                </div>

                {/* CARRUSEL DE IMÁGENES SOLO EN MODO EDICIÓN */}
                {formData.idPropiedad && imagenesExistentes.length > 0 && (
                  <CarruselImagenesEdicion imagenes={imagenesExistentes} onEliminar={eliminarImagenExistente} />
                )}

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormVisible(false);
                      setImagen(null);
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