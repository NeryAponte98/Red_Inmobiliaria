import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './componentes/Layout';
import Citas from './vistas/Citas';
import Propiedades from './vistas/Propiedades';
import Usuarios from './vistas/Usuarios';
import Inicio from './vistas/Inicio';
import Logout from './vistas/Logout';
import Favoritos from './vistas/Favoritos';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/propiedades" element={<Propiedades />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/logout" element={<Logout />} /> 
          <Route path="*" element={<Navigate to="/inicio" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;