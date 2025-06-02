// NoAutorizado.jsx
import { Link } from 'react-router-dom';

const NoAutorizado = () => {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '4rem' }}></i>
        </div>
        <h2 className="mb-3">Acceso No Autorizado</h2>
        <p className="text-muted mb-4">
          No tienes permisos para acceder a esta sección. 
          <br />
          Si crees que esto es un error, contacta al administrador.
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <Link to="/inicio" className="btn btn-primary">
            <i className="bi bi-house-door me-2"></i>
            Ir al Inicio
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline-secondary"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoAutorizado;