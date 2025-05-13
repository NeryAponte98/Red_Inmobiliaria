import '../estilos/login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// URL base para las peticiones API
const API_URL = "http://localhost:8094/api/auth";

const Login = () => {
    // Estados para formulario de login
    const [nombreUsuario, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // Estados para formulario de registro
    const [showRegister, setShowRegister] = useState(false);
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [tipoUsuarioId, setTipoUsuarioId] = useState(1); // Valor por defecto, ajustar según necesidad
    
    // Estados para manejo de errores y carga
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState('');
    
    const navigate = useNavigate();

    // Función para manejar el inicio de sesión
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const response = await axios.post(`${API_URL}/login`, {
                nombreUsuario,
                password
            });
            
            // Guardar token JWT en localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                id: response.data.id,
                username: response.data.username,
                email: response.data.email,
                role: response.data.role
            }));
            
            // Redirigir al usuario a la página de inicio
            navigate('/inicio');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar el registro de usuario
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setRegisterSuccess('');
        setLoading(true);
        
        try {
            const response = await axios.post(`${API_URL}/register`, {
                nombreUsuario: registerUsername,
                email: registerEmail,
                password: registerPassword,
                tipoUsuarioId: tipoUsuarioId
            });
            
            setRegisterSuccess('Registro exitoso. Ahora puede iniciar sesión.');
            // Limpiar el formulario
            setRegisterUsername('');
            setRegisterEmail('');
            setRegisterPassword('');
            // Volver al formulario de login después de 2 segundos
            setTimeout(() => {
                setShowRegister(false);
                setRegisterSuccess('');
            }, 2000);
        } catch (err) {
            setError(err.response?.data || 'Error al registrar usuario. Inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Función para alternar entre formularios
    const toggleRegister = () => {
        setShowRegister(!showRegister);
        setError(''); // Limpiar mensajes de error al cambiar de formulario
        setRegisterSuccess('');
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <div className="login-logo">
                    <i className="bi bi-building me-2"></i>
                    <h1>Red Inmobiliaria</h1>
                </div>

                {/* Mensaje de error global */}
                {error && <div className="alert alert-danger">{error}</div>}
                {registerSuccess && <div className="alert alert-success">{registerSuccess}</div>}

                {!showRegister ? (
                    // Formulario de Login
                    <form className="login-form" onSubmit={handleLogin}>
                        <h2>Iniciar Sesión</h2>
                        
                        <div className="form-group">
                            <label htmlFor="username">Usuario</label>
                            <input
                                type="text"
                                id="username"
                                value={nombreUsuario}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Ingrese su usuario"
                                required
                                disabled={loading}
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
                                disabled={loading}
                            />
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn-primary1" 
                                disabled={loading}
                            >
                                {loading ? 'Ingresando...' : 'Ingresar'}
                            </button>
                        </div>
                        
                        <div className="form-actions">
                            <div className="login-options">
                                <a href="#" className="forgot-password">¿Olvidó su contraseña?</a>
                                <button 
                                    type="button" 
                                    className="register-link" 
                                    onClick={toggleRegister}
                                    disabled={loading}
                                >
                                    Crear cuenta
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    // Formulario de Registro
                    <form className="register-form" onSubmit={handleRegister}>
                        <h2>Crear Cuenta</h2>
                        
                        <div className="form-group">
                            <label htmlFor="registerUsername">Usuario</label>
                            <input
                                type="text"
                                id="registerUsername"
                                value={registerUsername}
                                onChange={(e) => setRegisterUsername(e.target.value)}
                                placeholder="Cree un usuario"
                                required
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                                placeholder="Ingrese su correo"
                                required
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="registerPassword">Contraseña</label>
                            <input
                                type="password"
                                id="registerPassword"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                                placeholder="Cree una contraseña"
                                required
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="tipoUsuario">Tipo de Usuario</label>
                            <select
                                id="tipoUsuario"
                                value={tipoUsuarioId}
                                onChange={(e) => setTipoUsuarioId(Number(e.target.value))}
                                required
                                disabled={loading}
                            >
                                <option value="1">Cliente</option>
                                <option value="2">Agente Inmobiliario</option>
                                {/* Añadir más opciones según los tipos disponibles */}
                            </select>
                        </div>
                        
                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn-primary1"
                                disabled={loading}
                            >
                                {loading ? 'Registrando...' : 'Registrarse'}
                            </button>
                            <button 
                                type="button" 
                                className="back-to-login" 
                                onClick={toggleRegister}
                                disabled={loading}
                            >
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