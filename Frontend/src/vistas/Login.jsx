import '../estilos/login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () =>{

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showRegister, setShowRegister] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Aquí iría la lógica de autenticación en el futuro
        // Por ahora, simplemente navegamos a la página de inicio
        navigate('/inicio');
    };

  const toggleRegister = () => {
    setShowRegister(!showRegister);
  };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <div className="login-logo">
                <i className="bi bi-building me-2"></i>
                <h1>Red Inmobiliaria</h1>
                </div>

                {!showRegister ? (
                // Formulario de Login
                <form className="login-form" onSubmit={handleLogin}>
                    <h2>Iniciar Sesión</h2>
                    
                    <div className="form-group">
                    <label htmlFor="username">Usuario</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ingrese su usuario"
                        required
                    />
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingrese su contraseña"
                        required
                    />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary1">Ingresar</button>
                    </div>
                    
                    <div className="form-actions">
                        <div className="login-options">
                            <a href="#" className="forgot-password">¿Olvidó su contraseña?</a>
                            <button type="button" className="register-link" onClick={toggleRegister}>
                            Crear cuenta
                            </button>
                        </div>
                    </div>
                </form>
                ) : (
                // Formulario de Registro
                <form className="register-form">
                    <h2>Crear Cuenta</h2>
                    
                    <div className="form-group">
                    <label htmlFor="newUsername">Usuario</label>
                    <input
                        type="text"
                        id="newUsername"
                        placeholder="Cree un usuario"
                        required
                    />
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Ingrese su correo"
                        required
                    />
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="newPassword">Contraseña</label>
                    <input
                        type="password"
                        id="newPassword"
                        placeholder="Cree una contraseña"
                        required
                    />
                    </div>
                    
                    <div className="form-actions">
                    <button type="submit" className="btn-primary1">Registrarse</button>
                    <button type="button" className="back-to-login" onClick={toggleRegister}>
                        Volver a inicio de sesión
                    </button>
                    </div>
                </form>
                )}
            </div>
        </div>
    );
}

export default Login;