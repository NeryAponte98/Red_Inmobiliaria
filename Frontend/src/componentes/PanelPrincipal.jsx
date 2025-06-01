// src/components/PanelPrincipal.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../estilos/PanelPrincipal.css';
import Map from '../servicios/map.jsx'
import 'leaflet/dist/leaflet.css';


async function obtenerImagenDePropiedad(idPropiedad) {
  try {
    const response = await fetch(`http://localhost:8094/api/imagenPropiedad/propiedad/${idPropiedad}`);
    if (response.status === 404) {
      // Imagen no encontrada, usar una por defecto sin imprimir errores
      return "/assets/default.jpg";
    }
    if (!response.ok) {
      return "/assets/default.jpg";
    }
    return await response.text();
  } catch (error) {
    console.warn(`Error al conectar con el backend para imagen ${idPropiedad}:`, error.message);
    return "/assets/default.jpg";
  }
}

function PanelPrincipal() {
  const [propiedades, setPropiedades] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarPropiedades() {
    try {
      const res = await fetch("http://localhost:8094/api/propiedades");
      const data = await res.json();

      const propiedadesConImagen = await Promise.all(
        data.map(async (prop) => {
          const imagenURL = await obtenerImagenDePropiedad(prop.idPropiedad);
          return { ...prop, imagenURL };
        })
      );

      setPropiedades(propiedadesConImagen);
    } catch (error) {
      console.error("Error cargando propiedades:", error);
    }
  }

  cargarPropiedades();
}, []);

  return (
<div className="panel-principal">
      {/* Partículas flotantes decorativas */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Título principal */}
      <div className="panel-title">
        <h1>Encuentra tu Inmueble Ideal</h1>
        <p>Descubre las mejores propiedades disponibles</p>
      </div>

    {/* Grid de propiedades */}
      {propiedades.length > 0 ? (
        <div className="propiedades-grid">
          {propiedades.map((prop) => (
            <div key={prop.idPropiedad} className="propiedad-card">
              <div className="imagen-container">
                <img 
                  src={prop.imagenURL} 
                  alt="Propiedad" 
                  className="propiedad-imagen"
                  onError={(e) => {e.target.src = "/assets/default.jpg"}}
                />
                <div className="imagen-overlay"></div>
                <div className="tipo-badge">
                  {prop.operacion?.nombreOperacion || "Disponible"}
                </div>
              </div>
              
              <div className="card-content">
                <h4 className="propiedad-titulo">
                  {prop.tipo?.nombreTipoPropiedad || "Propiedad"}
                </h4>
                
                <p className="propiedad-direccion">
                  {prop.direccion}
                </p>
                
                <button
                  onClick={() => navigate(`/crear-cita/${prop.idPropiedad}`)}
                  className="agendar-btn"
                >
                  Agendar Cita
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-propiedades">
          <p>No hay propiedades disponibles en este momento</p>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <Map />
      </div>
    </div>
  );
  
}

export default PanelPrincipal;
