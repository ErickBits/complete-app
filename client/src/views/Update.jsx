import { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import "../style-sheets/update.css";

function Update() {
  const [email, setEmail] = useState(''); 
  const [name, setName] = useState(''); 
  const [lastname, setLastName] = useState(''); 
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

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

    // Validación de contraseña si se proporciona
    if (password && password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setIsLoading(false);
      return;
    }

    // Corregido: debe ser un objeto, no un array
    const Data = {
      email,
      name,
      lastname,
      password
    };

    try {
      const response = await fetch("http://localhost:5100/bread_network/update", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(Data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Error al actualizar el perfil');
      }

      const token = result.token;
      if (token) localStorage.setItem('token', token);

      console.log('User updated:', result);
      setSuccess(true);

      // Limpiar solo la contraseña después de actualizar
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

  return (
    <div className="update-container">
      <div className="update-wrapper">
        
        <div className="update-card">
          
          {/* Header */}
          <div className="update-header">
            <div className="icon-circle">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="update-title">Actualizar Perfil</h1>
            <p className="update-subtitle">Modifica tu información personal</p>
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
                <p className="alert-text">¡Perfil actualizado exitosamente!</p>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={UpdateUser} className="update-form">
            
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
              <label className="form-label">Nueva contraseña (opcional)</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Dejar en blanco para no cambiar"
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
              <p className="help-text">Deja este campo vacío si no deseas cambiar tu contraseña</p>
              
              {/* Indicador de fortaleza de contraseña */}
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

            {/* Botones */}
            <div className="button-group">
              <Button
                type="submit"
                text={isLoading ? "Actualizando..." : "Guardar cambios"}
                disabled={isLoading}
                className={`submit-button ${isLoading ? 'loading' : ''}`}
              />
              <button
                type="button"
                className="cancel-button"
                onClick={() => window.history.back()}
              >
                Cancelar
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="update-footer">
            <div className="info-box">
              <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="info-text">
                Tus datos están protegidos y encriptados
              </p>
            </div>
          </div>
        </div>

        {/* Texto adicional */}
        <p className="terms-text">
          Última actualización hace 2 días
        </p>
      </div>
    </div>
  );
}

export default Update;