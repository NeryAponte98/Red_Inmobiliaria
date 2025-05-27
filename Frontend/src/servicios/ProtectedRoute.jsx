import { Navigate } from 'react-router-dom';
import AuthService from './AuthServices';

// Componente para proteger rutas privadas
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  // Si el usuario no está autenticado, redirigimos al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Si está autenticado, mostramos el componente hijo
  return children;
};

export default ProtectedRoute;