import "../estilos/map.css";
import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

// Ícono personalizado
const customIcon = new Icon({
  iconUrl: "https://images.icon-icons.com/1077/PNG/512/placeholder_77927.png",
  iconSize: [38, 38],
});

// Lista de marcadores
const markers = [
  {
    geocode: [7.117461143167635, -73.11254869038605],
    popUp: "Inmueble 1"
  },
  {
    geocode: [7.119, -73.114],
    popUp: "Inmueble 2"
  },
  {
    geocode: [7.115, -73.110],
    popUp: "Inmueble 3"
  }
];

export default function Map() {
  return (
    <MapContainer center={[7.117461143167635, -73.11254869038605]} zoom={13} style={{ height: "400px", width: "100%" }}>
      {/* Mapa base de OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcadores individuales sin clustering */}
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.geocode} icon={customIcon}>
          <Popup>{marker.popUp}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
