import React, { useEffect, useState } from 'react';
import '../estilos/VerCitas.css';


export default function VerCitas() {
  const [citas, setCitas] = useState([]);
  const [citaEditando, setCitaEditando] = useState(null);
  const [fechaHora, setFechaHora] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const userData = JSON.parse(atob(token.split('.')[1]));
    const idUsuario = userData.id;

    fetch(`http://localhost:8094/api/citas/list`)
    .then(res => res.json())
    .then(data => {

    const citasDelUsuario = data.filter(cita => 
        cita.idCliente?.id === idUsuario);
        setCitas(citasDelUsuario);
    });
  }, []);

  const eliminarCita = (id) => {
    if (!window.confirm("¿Deseas eliminar esta cita?")) return;
    fetch(`http://localhost:8094/api/citas/${id}`, { method: 'DELETE' })
      .then(() => {
        setCitas(citas.filter(c => c.id !== id));
        alert("Cita eliminada");
      })
      .catch(err => alert("Error al eliminar: " + err.message));
  };

  const abrirModalEditar = (cita) => {
    setCitaEditando(cita);
    setFechaHora(cita.fechaHora.slice(0, 16)); // formato para datetime-local
  };

  const guardarEdicion = () => {
    const citaActualizada = {
        idCliente: citaEditando.idCliente.id,
        idPropiedad: citaEditando.idPropiedad.idPropiedad,
        idEstado: citaEditando.idEstado.id,
        fechaHora,
};


    fetch(`http://localhost:8094/api/citas/${citaEditando.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(citaActualizada)
    })
      .then(() => {
        alert("Cita actualizada");
        setCitaEditando(null);
        window.location.reload(); // o mejor: volver a llamar setCitas con datos actualizados
      });
  };

  return (<div className="citas-wrapper">
      <div className="citas-container">
        <h2 className="citas-title">Mis citas agendadas</h2>

        {citas.length === 0 ? (
          <div className="empty-state">
            <h3>No tienes citas agendadas</h3>
            <p>Cuando agendes una cita, aparecerá aquí.</p>
          </div>
        ) : (
          <table className="citas-table">
            <thead className="citas-table-header">
              <tr>
                <th>Dirección</th>
                <th>Fecha | Hora</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map(cita => (
                <tr key={cita.id} className="citas-table-row">
                  <td className="direccion-cell">
                    {cita.idPropiedad?.direccion || "N/D"}
                  </td>
                  <td className="fecha-cell">
                    {new Date(cita.fechaHora).toLocaleString()}
                  </td>
                  <td>
                    <span className="estado-cell">
                      {cita.idEstado?.nombre || "Pendiente"}
                    </span>
                  </td>
                  <td className="acciones-cell">
                    <button
                      onClick={() => abrirModalEditar(cita)}
                      className="btn-editar"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarCita(cita.id)}
                      className="btn-eliminar"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {citaEditando && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="modal-title">Editar cita</h3>
              <label className="modal-label">Nueva fecha y hora:</label>
              <input
                type="datetime-local"
                value={fechaHora}
                onChange={(e) => setFechaHora(e.target.value)}
                className="modal-input"
              />
              <div className="modal-buttons">
                <button
                  onClick={guardarEdicion}
                  className="btn-guardar"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setCitaEditando(null)}
                  className="btn-cancelar"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
