import { Navigate } from 'react-router-dom';
import AuthService from './AuthServices';

// Componente para proteger rutas privadas
const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  excludeRole = null,
  redirectTo = '/login',
  unauthorizedRedirect = '/no-autorizado'
}) => {
  // Verificar si el usuario está autenticado
  if (!AuthService.isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // Obtener el rol del usuario actual
  const userRole = AuthService.getUserRole();

  // Si hay un rol excluido, verificar que el usuario no lo tenga
  if (excludeRole && userRole === excludeRole) {
    return <Navigate to={unauthorizedRedirect} replace />;
  }

  // Si hay roles requeridos, verificar que el usuario tenga uno de ellos
  if (requiredRole) {
    // Si requiredRole es un array, verificar si el usuario tiene alguno de los roles
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(userRole)) {
        return <Navigate to={unauthorizedRedirect} replace />;
      }
    } 
    // Si requiredRole es una cadena, verificar rol específico
    else if (userRole !== requiredRole) {
      return <Navigate to={unauthorizedRedirect} replace />;
    }
  }

  // Si pasa todas las verificaciones, renderizar el componente hijo
  return children;
};

export default ProtectedRoute;