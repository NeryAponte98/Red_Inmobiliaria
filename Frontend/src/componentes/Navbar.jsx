import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <NavLink className="sidebar-brand" to="/">
          {/*<i className="bi bi-building me-2"></i>*/}
          <img src={logo} alt="Logo" height="40" className="d-inline-block align-top me-2" />
          
          <span className="brand-text">Red Inmobiliaria</span>
        </NavLink>
        <button className="sidebar-toggle d-md-none" onClick={toggleSidebar}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      
      <ul className="sidebar-nav">
        <li className="sidebar-item">
          <NavLink 
            className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"} 
            to="/inicio"
          >
            <i className="bi bi-house me-2"></i>
            <span>Inicio</span>
          </NavLink>
        </li>

        <li className="sidebar-item">
          <NavLink 
            className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"} 
            to="/propiedades"
          >
            <i className="bi bi-list-check me-2"></i>
            <span>Propiedades</span>
          </NavLink>
        </li>

        <li className="sidebar-item">
          <NavLink 
            className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"} 
            to="/citas"
          >
            <i className="bi bi-calendar me-2"></i>
            <span>Citas</span>
          </NavLink>
        </li>

        <li className="sidebar-item">
          <NavLink 
            className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"} 
            to="/favoritos"
          >
            <i className="bi bi-heart me-2"></i>
            <span>Favoritos</span>
          </NavLink>
        </li>

        <li className="sidebar-item">
          <NavLink 
            className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"} 
            to="/mi-perfil"
          >
            <i className="bi bi-person-badge me-2"></i>
            <span>Mi perfil</span>
          </NavLink>
        </li>

        <li className="sidebar-item">
          <NavLink 
            className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"} 
            to="/usuarios"
          >
            <i className="bi bi-people me-2"></i>
            <span>Usuarios</span>
          </NavLink>
        </li>

       <li className="sidebar-item">
          <NavLink 
            className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"} 
            to="/login"
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            <span>Logout</span>
          </NavLink>
        </li>

      </ul>
      
      <div className="sidebar-footer">
        <p>© {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default Navbar;