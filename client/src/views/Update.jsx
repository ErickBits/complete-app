import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style-sheets/update.css";

function Update() {
  const navigate = useNavigate();
  const [name, setName] = useState(''); 
  const [lastname, setLastName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/signup', { replace: true });
        return;
      }

      try {
        const response = await fetch('http://localhost:5100/bread_network/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          localStorage.removeItem('token');
          navigate('/signup', { replace: true });
          return;
        }

        const userData = await response.json();
        setName(userData.name || '');
        setLastName(userData.lastname || '');
        setEmail(userData.email || '');
        setIsCheckingAuth(false);

      } catch (error) {
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem('token');
        navigate('/signup', { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  const checkPasswordStrength = (pass) => {
    if (!pass) {
      setPasswordStrength(0);
      return;
    }
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

  async function UpdateUser(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password && password.length < 8) {
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
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/signup', { replace: true });
        return;
      }

      const response = await fetch("http://localhost:5100/bread_network/update", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(Data)
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        navigate('/signup', { replace: true });
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Error al actualizar el perfil');
      }

      const newToken = result.token;
      if (newToken) localStorage.setItem('token', newToken);

      console.log('User updated:', result);
      setSuccess(true);

      setTimeout(() => {
        setPassword('');
        setPasswordStrength(0);
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error al actualizar. Intenta nuevamente.');
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

  if (isCheckingAuth) {
    return (
      <div className="update-loading">
        <div className="spinner"></div>
        <p>Cargando datos del perfil...</p>
      </div>
    );
  }

  return (
    <div className="update-container">
      <div className="update-card">
        
        {/* Header */}
        <div className="update-header">
          <div className="header-icon-circle">
            <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="update-title">Actualizar Perfil</h1>
          <p className="update-subtitle">Modifica tu información personal</p>
        </div>

        {/* Mensaje de éxito */}
        {success && (
          <div className="success-message">
            <svg className="message-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>¡Perfil actualizado exitosamente!</p>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="error-message">
            <svg className="message-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {/* Formulario */}
        <form className="update-form" onSubmit={UpdateUser}>
          
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled
              className="input-disabled"
            />
            <p className="input-help">El correo no puede ser modificado</p>
          </div>

          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastname">Apellido</label>
            <input
              type="text"
              id="lastname"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Tu apellido"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Nueva Contraseña (Opcional)</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Dejar en blanco para mantener la actual"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {password && (
              <div className="password-strength">
                <div className={`strength-bar ${getStrengthClass()}`}>
                  <div className="strength-fill" style={{ width: `${(passwordStrength / 4) * 100}%` }}></div>
                </div>
                <p className="strength-text">{getStrengthText()}</p>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/profile')}
              disabled={isLoading}
            >
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner-small"></div>
                  Actualizando...
                </>
              ) : (
                <>
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar Cambios
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Update;