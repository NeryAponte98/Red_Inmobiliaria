// src/components/PanelPrincipal.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../estilos/PanelPrincipal.css';
import Map from '../servicios/map.jsx'
import 'leaflet/dist/leaflet.css';

function CarruselImagenes({ imagenes }) {
  const [index, setIndex] = useState(0);
  if (!imagenes || imagenes.length === 0) {
    imagenes = ["/assets/default.jpg"];
  }

  const siguiente = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % imagenes.length);
  };
  const anterior = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  return (
    <div className="carrusel-imagenes">
      <button className="carrusel-btn carrusel-btn--left" onClick={anterior} disabled={imagenes.length === 1}>&lt;</button>
      <img
        src={imagenes[index]}
        alt="Propiedad"
        className="propiedad-imagen"
        onError={(e) => { e.target.src = "/assets/default.jpg"; }}
      />
      <button className="carrusel-btn carrusel-btn--right" onClick={siguiente} disabled={imagenes.length === 1}>&gt;</button>
    </div>
  );
}

async function obtenerImagenesDePropiedad(idPropiedad) {
  try {
    const response = await fetch(`http://localhost:8094/api/imagenPropiedad/propiedad/${idPropiedad}`);
    if (!response.ok) {
      return ["/assets/default.jpg"];
    }
    const data = await response.json();
    if(data.length>0 && Array.isArray(data)){
      return data.map(img =>
          img.urlImagen.startsWith('http')
            ? img.urlImagen
            : `http://localhost:8094${img.urlImagen}`
        );
      
    } else {
        return ["/assets/default.jpg"];
    }
  } catch (error) {
    console.warn(`Error al conectar con el backend para imagen ${idPropiedad}:`, error.message);
    return ["/assets/default.jpg"];
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

      const propiedadesConImagenes = await Promise.all(
        data.map(async (prop) => {
          const imagenes = await obtenerImagenesDePropiedad(prop.idPropiedad);
          return { ...prop, imagenes };
        })
      );

      setPropiedades(propiedadesConImagenes);
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
                <CarruselImagenes imagenes={prop.imagenes} />{}
                <div className='image-overlay'></div>
                <div className='tipo-badge'>
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