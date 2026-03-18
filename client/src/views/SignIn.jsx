import { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import "../style-sheets/sign_in.css";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function LogIn(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const Data = { email, password };

    try {
      const response = await fetch("http://localhost:5100/bread_network/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Credenciales incorrectas');
      }

      const token = result.token;
      if (token) localStorage.setItem('token', token);

      console.log('User logged:', result);
      setSuccess(true);

      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        // window.location.href = '/dashboard'; // Descomenta para redirigir
      }, 1500);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        
        <div className="login-card">
          
          {/* Header */}
          <div className="login-header">
            <div className="icon-circle">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="login-title">Bienvenido</h1>
            <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
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
                <p className="alert-text">¡Inicio de sesión exitoso! Redirigiendo...</p>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={LogIn} className="login-form">
            
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

            {/* Contraseña */}
            <div className="form-group">
              <div className="label-row">
                <label className="form-label">Contraseña</label>
                <a href="/forgot-password" className="forgot-link">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Recordarme */}
            <div className="remember-me">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox" />
                <span>Recordarme</span>
              </label>
            </div>

            {/* Botón de login */}
            <Button
              type="submit"
              text={isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              disabled={isLoading}
              className={`submit-button ${isLoading ? 'loading' : ''}`}
            />
          </form>

          
          {/* Footer */}
          <div className="login-footer">
            <p className="footer-text">
              ¿No tienes cuenta?{' '}
              <a href="/register" className="footer-link">
                Regístrate gratis
              </a>
            </p>
          </div>
        </div>

        {/* Texto adicional */}
        <p className="terms-text">
          Protegido por reCAPTCHA - Términos y Privacidad de Google
        </p>
      </div>
    </div>
  );
}

export default Login;