import "../estilos/map.css";
import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

// marker icon
const customIcon = new Icon({
  iconUrl: "https://images.icon-icons.com/1077/PNG/512/placeholder_77927.png",
  iconSize: [38, 38],
});


export default function Map() {
  const [propiedades, setPropiedades] = useState([]);
  
 // Cargar propiedades desde el backend al montar el componente
  useEffect(() => {
    fetch("http://localhost:8094/api/propiedades")
      .then((res) => res.json())
      .then((data) => {

        const propiedadesConUbicacion = data.filter(
          (p) => p.latitud && p.longitud
        );
        setPropiedades(propiedadesConUbicacion);
      })
      .catch((err) => {
        console.error("Error al cargar propiedades:", err);
      });
  }, []);
  
  
  return (
    <MapContainer center={[7.117461143167635, -73.11254869038605]} zoom={13} style={{ height: "400px", width: "100%" }}>
      {/* Mapa base de OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcadores dinámicos desde el backend */}
      {propiedades.map((propiedad) => (
        <Marker
          key={propiedad.idPropiedad}
          position={[propiedad.latitud, propiedad.longitud]}
          icon={customIcon}
        >
          <Popup>
            <strong>{propiedad.direccion}</strong>
            <br />
            Precio: ${propiedad.precio}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
