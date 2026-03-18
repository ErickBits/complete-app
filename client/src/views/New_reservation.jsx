import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style-sheets/New_reservation.css";

function NewReservation() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    tableNumber: '',
    numberOfGuests: '',
    date: '',
    time: '',
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});

  //verificar token
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      // Si no hay token, redirigir inmediatamente
      if (!token) {
        navigate('/signin', { replace: true });
        return;
      }

      // Verificar que el token sea válido 
      try {
        const response = await fetch('http://localhost:5100/bread_network/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          // Token inválido o expirado
          localStorage.removeItem('token');
          navigate('/signup', { replace: true });
          return;
        }

        // Token válido, permitir acceso
        setIsCheckingAuth(false);

      } catch (error) {
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem('token');
        navigate('/signup', { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  //Mostrar loading mientras verifica
  if (isCheckingAuth) {
    return (
      <div className="new-reservation-loading">
        <div className="spinner"></div>
        <p>Verificando acceso...</p>
      </div>
    );
  }

  // Obtener fecha mínima (hoy)
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'El nombre es requerido';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Email inválido';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.customerPhone.replace(/\D/g, ''))) {
      newErrors.customerPhone = 'Teléfono debe tener 10 dígitos';
    }

    if (!formData.tableNumber) {
      newErrors.tableNumber = 'Selecciona una mesa';
    }

    if (!formData.numberOfGuests) {
      newErrors.numberOfGuests = 'Ingresa el número de invitados';
    } else if (formData.numberOfGuests < 1 || formData.numberOfGuests > 12) {
      newErrors.numberOfGuests = 'Debe ser entre 1 y 12 personas';
    }

    if (!formData.date) {
      newErrors.date = 'Selecciona una fecha';
    }

    if (!formData.time) {
      newErrors.time = 'Selecciona una hora';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/signup');
        return;
      }

      const response = await fetch('http://localhost:5100/bread_network/reservations/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/reservations');
        }, 2000);
      } else {
        setError(data.error || 'Error al crear la reservación');
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      tableNumber: '',
      numberOfGuests: '',
      date: '',
      time: '',
      specialRequests: ''
    });
    setErrors({});
    setError('');
    setSuccess(false);
  };

  return (
    <div className="new-reservation-container">
      
      {/* Header */}
      <div className="new-reservation-header">
        <div className="header-content">
          <div className="header-icon-circle">
            <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h1 className="page-title">Nueva Reservación</h1>
            <p className="page-subtitle">Completa el formulario para crear tu reservación</p>
          </div>
        </div>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="success-message">
          <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>¡Reservación creada exitosamente! Redirigiendo...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="form-card">
        <form onSubmit={handleSubmit} className="reservation-form">
          
          {/* Información Personal */}
          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Información Personal
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="customerName">Nombre Completo *</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className={errors.customerName ? 'input-error' : ''}
                  placeholder="Juan Pérez"
                />
                {errors.customerName && <span className="error-text">{errors.customerName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="customerEmail">Correo Electrónico *</label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  className={errors.customerEmail ? 'input-error' : ''}
                  placeholder="juan@example.com"
                />
                {errors.customerEmail && <span className="error-text">{errors.customerEmail}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="customerPhone">Teléfono *</label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  className={errors.customerPhone ? 'input-error' : ''}
                  placeholder="3001234567"
                />
                {errors.customerPhone && <span className="error-text">{errors.customerPhone}</span>}
              </div>
            </div>
          </div>

          {/* Detalles de la Reservación */}
          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Detalles de la Reservación
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="date">Fecha *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={getMinDate()}
                  className={errors.date ? 'input-error' : ''}
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="time">Hora *</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={errors.time ? 'input-error' : ''}
                />
                {errors.time && <span className="error-text">{errors.time}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="tableNumber">Número de Mesa *</label>
                <select
                  id="tableNumber"
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={handleChange}
                  className={errors.tableNumber ? 'input-error' : ''}
                >
                  <option value="">Selecciona una mesa</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>Mesa {i + 1}</option>
                  ))}
                </select>
                {errors.tableNumber && <span className="error-text">{errors.tableNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="numberOfGuests">Número de Invitados *</label>
                <input
                  type="number"
                  id="numberOfGuests"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  min="1"
                  max="12"
                  className={errors.numberOfGuests ? 'input-error' : ''}
                  placeholder="1-12"
                />
                {errors.numberOfGuests && <span className="error-text">{errors.numberOfGuests}</span>}
              </div>
            </div>
          </div>

          {/* Solicitudes Especiales */}
          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Solicitudes Especiales (Opcional)
            </h3>

            <div className="form-group">
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows="4"
                placeholder="Ej: Alergias alimentarias, celebración especial, preferencias de asientos..."
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary"
              disabled={isLoading}
            >
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Limpiar
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner-small"></div>
                  Creando...
                </>
              ) : (
                <>
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Crear Reservación
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Info Card */}
      <div className="info-card">
        <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="info-content">
          <h4>Información Importante</h4>
          <ul>
            <li>Tu reservación quedará en estado <strong>pendiente</strong> hasta ser aprobada por un administrador</li>
            <li>Recibirás una notificación por correo cuando tu reservación sea confirmada</li>
            <li>Las mesas tienen capacidad máxima de 12 personas</li>
            <li>Puedes cancelar tu reservación hasta 24 horas antes</li>
          </ul>
        </div>
      </div>

    </div>
  );
}

export default NewReservation;