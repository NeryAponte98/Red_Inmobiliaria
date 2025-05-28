import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../servicios/AuthServices';

const Logout = () => {
  const [loggedOut, setLoggedOut] = useState(false);
  console.log("Cerrar sesion");
  useEffect(() => {
    AuthService.logout();
    setLoggedOut(true);
  }, []);

  if (loggedOut) {
    return <Navigate to="/login" replace />;
  }

  return null;
};

export default Logout;
