import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style-sheets/profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [stats, setStats] = useState({
    totalReservations: 0,
    upcomingReservations: 0,
    pastReservations: 0,
    cancelledReservations: 0
  });

  useEffect(() => {
    fetchUserData();
    fetchUserStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/signin');
        return;
      }

      // Decodificar token para obtener el rol
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      setIsAdmin(decoded.role === 'admin');

      // Obtener perfil del usuario
      const response = await fetch('http://localhost:5100/bread_network/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setError('Error al cargar el perfil');
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar datos del usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5100/bread_network/reservations/my-reservations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const reservations = await response.json();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = reservations.filter(r => 
          new Date(r.date) >= today && (r.status === 'pending' || r.status === 'confirmed')
        ).length;

        const past = reservations.filter(r => 
          new Date(r.date) < today
        ).length;

        const cancelled = reservations.filter(r => r.status === 'cancelled').length;

        setStats({
          totalReservations: reservations.length,
          upcomingReservations: upcoming,
          pastReservations: past,
          cancelledReservations: cancelled
        });
      }

    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5100/bread_network/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        navigate('/signup');
      } else {
        setError('Error al eliminar la cuenta');
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Error al eliminar la cuenta');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <div className="header-icon-circle">
            <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="page-title">Mi Perfil</h1>
            <p className="page-subtitle">Información de tu cuenta</p>
          </div>
        </div>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {/* Profile Content */}
      <div className="profile-content">
        
        {/* User Info Card */}
        <div className="user-info-card">
          <div className="user-avatar-large">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          <div className="user-info">
            <h2 className="user-name">{user?.name} {user?.lastname}</h2>
            <p className="user-email">{user?.email}</p>
            
            <div className="user-badge">
              {isAdmin ? (
                <>
                  <svg className="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Administrador
                </>
              ) : (
                <>
                  <svg className="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Usuario Regular
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            <button className="btn-edit" onClick={() => navigate('/update')}>
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Perfil
            </button>
            
            <button className="btn-delete" onClick={() => setShowDeleteModal(true)}>
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar Cuenta
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-section">
          <h3 className="section-title">Mis Estadísticas</h3>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper stat-primary">
                <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Reservaciones</p>
                <p className="stat-value">{stats.totalReservations}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-success">
                <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Próximas</p>
                <p className="stat-value">{stats.upcomingReservations}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-info">
                <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Completadas</p>
                <p className="stat-value">{stats.pastReservations}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-danger">
                <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Canceladas</p>  
                <p className="stat-value">{stats.cancelledReservations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-links-section">
          <h3 className="section-title">Accesos Rápidos</h3>
          
          <div className="quick-links-grid">
            <button className="quick-link-card" onClick={() => navigate('/reservations')}>
              <svg className="quick-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <h4>Mis Reservaciones</h4>
                <p>Ver todas mis reservaciones</p>
              </div>
              <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button className="quick-link-card" onClick={() => navigate('/new')}>
              <svg className="quick-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <div>
                <h4>Nueva Reservación</h4>
                <p>Crear una nueva reservación</p>
              </div>
              <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button className="quick-link-card" onClick={() => navigate('/statistics')}>
              <svg className="quick-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <h4>Estadísticas</h4>
                <p>Ver mis estadísticas</p>
              </div>
              <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <svg className="modal-icon-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3>¿Eliminar cuenta?</h3>
            </div>
            
            <p className="modal-text">
              Esta acción es <strong>permanente</strong> y no se puede deshacer. 
              Se eliminarán todos tus datos y reservaciones.
            </p>

            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirm-delete" 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="spinner-small"></div>
                    Eliminando...
                  </>
                ) : (
                  'Sí, eliminar cuenta'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;