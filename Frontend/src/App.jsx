// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import setupAxiosInterceptors from './servicios/AxiosInterceptor';
import AuthService from './servicios/AuthServices';
import ProtectedRoute from './servicios/ProtectedRoute.js';
import Layout from './componentes/Layout';
import Citas from './vistas/Citas';
import Propiedades from './vistas/Propiedades';
import Usuarios from './vistas/Usuarios';
import Inicio from './vistas/Inicio';
import Logout from './vistas/Logout';
import Favoritos from './vistas/Favoritos';
import Login from './vistas/Login';

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
        
        {/* Rutas protegidas dentro del Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/propiedades" element={<Propiedades />} />
          {/* Ruta protegida con rol específico */}
          <Route path="/usuarios" element={
            <ProtectedRoute requiredRole="ADMIN">
              <Usuarios />
            </ProtectedRoute>
          } />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<Navigate to="/inicio" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;