import { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import "../style-sheets/register.css";

function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setPassword(pass);
    checkPasswordStrength(pass);
  };

  async function RegisterUser(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setIsLoading(false);
      return;
    }

    const Data = {
      email,
      name,
      lastname,
      password
    };

    try {
      const response = await fetch('http://localhost:5100/bread_network/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      const result = await response.json();
      console.log('User registered:', result);
      setSuccess(true);
      
      setTimeout(() => {
        setEmail('');
        setName('');
        setLastName('');
        setPassword('');
        setPasswordStrength(0);
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Hubo un error al registrar. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }

  const getStrengthClass = () => {
    if (passwordStrength === 0) return 'strength-none';
    if (passwordStrength === 1) return 'strength-weak';
    if (passwordStrength === 2) return 'strength-fair';
    if (passwordStrength === 3) return 'strength-good';
    return 'strength-strong';
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Débil';
    if (passwordStrength === 2) return 'Regular';
    if (passwordStrength === 3) return 'Buena';
    return 'Excelente';
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        
        <div className="register-card">
          
          {/* Header */}
          <div className="register-header">
            <div className="icon-circle">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="register-title">Crear Cuenta</h1>
            <p className="register-subtitle">Completa tus datos para registrarte</p>
          </div>

          {/* Mensajes de estado */}
          {error && (
            <div className="alert alert-error">
              <div className="alert-content">
                <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="alert-text">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <div className="alert-content">
                <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="alert-text">¡Registro exitoso! Bienvenido.</p>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={RegisterUser} className="register-form">
            
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@ejemplo.com"
                  required
                />
              </div>
            </div>

            {/* Nombre y Apellido */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <Input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Juan"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Apellido</label>
                <Input
                  type="text"
                  value={lastname}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Pérez"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              {/* Indicador de fortaleza */}
              {password && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`strength-bar ${level <= passwordStrength ? getStrengthClass() : ''}`}
                      />
                    ))}
                  </div>
                  <p className={`strength-text ${getStrengthClass()}`}>
                    {getStrengthText()}
                  </p>
                </div>
              )}
            </div>

            {/* Botón */}
            <Button
              type="submit"
              text={isLoading ? "Registrando..." : "Crear cuenta"}
              disabled={isLoading}
              className={`submit-button ${isLoading ? 'loading' : ''}`}
            />
          </form>

          {/* Divisor */}
          <div className="divider">
            <span className="divider-text">O continúa con</span>
          </div>

          {/* Botones sociales */}
          <div className="social-buttons">
            <button type="button" className="social-button">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            
            <button type="button" className="social-button">
              <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Footer */}
          <div className="register-footer">
            <p className="footer-text">
              ¿Ya tienes cuenta?{' '}
              <a href="/SignUp" className="footer-link">
                Inicia sesión
              </a>
            </p>
          </div>
        </div>

        {/* Texto adicional */}
        <p className="terms-text">
          Al registrarte, aceptas nuestros términos de servicio y política de privacidad
        </p>
      </div>
    </div>
  );
}

export default Register;