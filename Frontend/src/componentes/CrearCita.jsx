import { useEffect, useState } from 'react';
import '../estilos/CitaForm.css';
import { data, useParams } from 'react-router-dom';



export default function CrearCita() {
  const {idPropiedad } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [propiedad, setPropiedad] = useState(null);
  const [fechaHora, setFechaHora] = useState('');
  const [urlImagen, setUrlImagen] = useState("/assets/default.jpg");


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const userData = JSON.parse(atob(token.split('.')[1]));
    const id = userData.id;

    // carga datos del usuario
    fetch(`http://localhost:8094/api/usuario/list/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUsuario(data);
      });

      // Cargar dirección
      if (idPropiedad) {
      fetch(`http://localhost:8094/api/propiedades/${idPropiedad}`)
        .then(res => {
          if (!res.ok) throw new Error("Error al cargar");
          return res.json();
        })
        .then(setPropiedad)
        .catch(() =>
          setPropiedad({ direccion: "No se pudo cargar la dirección" })
        );
      // Buscar la imagen
      fetch(`http://localhost:8094/api/imagenPropiedad/propiedad/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Sin imagen");
        }
        return res.text(); // porque devuelve la URL como texto plano
      })
      .then(setUrlImagen)
      .catch(() => {
        setUrlImagen("/img/default.jpg"); // ruta de imagen por defecto
      });
    }
  }, [idPropiedad]);

  const handleSubmit = (e) => {
    e.preventDefault();
   // espera IDs simples, no objetos anidados
    const cita = {
      idCliente: usuario.id,
      idPropiedad: parseInt(idPropiedad),
      fechaHora,
      idEstado: 1
    };

    console.log("Datos de la cita a enviar:", cita);

    fetch('http://localhost:8094/api/citas/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cita)
    }).then(response => {
      console.log("Status de respuesta:", response.status);
      
     // leer el cuerpo de la respuesta incluso si hay error
      return response.text().then(text => {
        console.log("Respuesta del servidor:", text);
        
        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}: ${text}`);
        }
        
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      });
    })
    .then(data => {
      console.log("Cita creada exitosamente:", data);
      alert('Cita agendada correctamente');
    })
    .catch(err => {
      console.error("Error completo:", err);
      alert('Error al agendar cita: ' + err.message);
    });
};

  return ( 
  <div className="cita-container">
      <div className="cita-form-card">
        <h2 className="cita-title">Agendar Cita</h2>
        
        <form onSubmit={handleSubmit} className="cita-form">
          <div className="field-group">
            <label className="field-label">Nombre del cliente:</label>
            <p className={`field-text ${!usuario ? 'loading' : ''}`}>
              {usuario ? usuario.nombre_usuario : 'Cargando...'}
            </p>
          </div>

          <div className="field-group">
            <label className="field-label">Dirección propiedad:</label>
            <p className={`field-text ${!propiedad ? 'loading' : ''}`}>
              {propiedad ? propiedad.direccion : 'Cargando...'}
            </p>
          </div>

          <div className="field-group">
            <label htmlFor="fechaHora" className="field-label">Fecha y Hora:</label>
            <input
              type="datetime-local"
              id="fechaHora"
              value={fechaHora}
              onChange={e => setFechaHora(e.target.value)}
              required
              className="datetime-input"
            />
          </div>

          <button type="submit" className="save-button">
            Guardar Cita
          </button>
        </form>
      </div>
    </div>
  );
}
