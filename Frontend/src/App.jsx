import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './componentes/Layout';
import Citas from './vistas/Citas';
import Propiedades from './vistas/Propiedades';
import Usuarios from './vistas/Usuarios';
import Inicio from './vistas/Inicio';
import Logout from './vistas/Logout';
import Favoritos from './vistas/Favoritos';
import Login from './vistas/Login';

function App() {
  return (
     <Router>
      <Routes>
        {/* Ruta de Login fuera del Layout */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas dentro del Layout */}
        <Route element={<Layout />}>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/propiedades" element={<Propiedades />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<Navigate to="/inicio" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;