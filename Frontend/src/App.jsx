import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import setupAxiosInterceptors from './servicios/AxiosInterceptor';
import AuthService from './servicios/AuthServices';
import ProtectedRoute from './servicios/ProtectedRoute';
import Layout from './componentes/Layout';
import Propiedades from './vistas/Propiedades';
import MiPerfil from './vistas/MiPerfil';
import Logout from './vistas/Logout';
import Favoritos from './vistas/Favoritos';
import Login from './vistas/Login';
import NoAutorizado from './componentes/NoAutorizado';
import CrearCita from './componentes/CrearCita';
import PanelPrincipal from './componentes/PanelPrincipal';
import VerCita from './componentes/VerCita';
import Usuarios from './componentes/Usuarios';

function App() {
  // Configurar interceptores de Axios al cargar la aplicación
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Ruta de Login accesible públicamente */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={
          // Redirigir a inicio si ya está autenticado
          AuthService.isAuthenticated() 
            ? <Navigate to="/inicio" replace /> 
            : <Login />
        } />

        <Route path="/logout" element={<Logout />} />
        
        {/* Rutas protegidas dentro del Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/inicio" element={<PanelPrincipal />} />
          <Route path="/citas" element={<VerCita />} />
          <Route path="/crear-cita/:idPropiedad" element={<CrearCita />} />
          <Route path="/mi-perfil" element={<MiPerfil/>} />
          
          {/* Ruta de Propiedades - Solo para usuarios que NO sean Cliente */}
          <Route path="/propiedades" element={
            <ProtectedRoute excludeRole="Cliente">
              <Propiedades />
            </ProtectedRoute>
          } />

          {/* Ruta de Usuarios - Solo para Administradores */}
          <Route path="/usuarios" element={
            <ProtectedRoute requiredRole="Administrador">
              <Usuarios />
            </ProtectedRoute>
          } />
          
          <Route path="/favoritos" element={<Favoritos />} />
          
          {/* Ruta para manejar acceso no autorizado */}
          <Route path="/no-autorizado" element={<NoAutorizado />} />
          
          <Route path="*" element={<Navigate to="/inicio" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;