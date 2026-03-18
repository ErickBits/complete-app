import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Asume que usas React Router
import "../style-sheets/dashboard.css";

function MainDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    // Stats para usuarios regulares
    myReservations: 0,
    upcomingReservations: 0,
    pastReservations: 0,
    // Stats para admin
    totalUsers: 0,
    totalReservations: 0,
    pendingReservations: 0,
    todayReservations: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/signin');
        return;
      }

      // Decodificar el token para obtener el rol
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
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar datos del usuario');
    }
  };

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      // ⭐ UNA SOLA LLAMADA para admin y usuario
      const response = await fetch('http://localhost:5100/bread_network/reservations/statistics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Actualizar stats con todos los datos que vienen del backend
        setStats(data);
      }

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="main-dashboard-container">
      
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="logo-section">
            <div className="logo-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h1 className="dashboard-title">Bread Network</h1>
              <p className="dashboard-subtitle">Sistema de Reservaciones</p>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info-header">
            <div className="user-avatar-header">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <p className="user-name-header">{user?.name || 'Usuario'} {user?.lastname || ''}</p>
              <p className="user-role-header">
                {isAdmin ? '👑 Administrador' : '👤 Usuario'}
              </p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg className="logout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Salir
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="welcome-section">
        <h2 className="welcome-title">
          ¡Bienvenido de vuelta, {user?.name || 'Usuario'}! 👋
        </h2>
        <p className="welcome-text">
          {isAdmin 
            ? 'Panel de administración - Gestiona usuarios, reservaciones y estadísticas'
            : 'Gestiona tus reservaciones y consulta tu perfil'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {isAdmin ? (
          <>
            {/* Stats para Admin */}
            <div className="stat-card stat-users">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Usuarios</p>
                <p className="stat-value">{stats.totalUsers}</p>
                <p className="stat-change">Registrados en el sistema</p>
              </div>
            </div>

            <div className="stat-card stat-reservations">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Reservaciones</p>
                <p className="stat-value">{stats.totalReservations}</p>
                <p className="stat-change">Todas las reservaciones</p>
              </div>
            </div>

            <div className="stat-card stat-pending">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Solicitudes Pendientes</p>
                <p className="stat-value">{stats.pendingReservations}</p>
                <p className="stat-change">Requieren aprobación</p>
              </div>
            </div>

            <div className="stat-card stat-today">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Reservaciones Hoy</p>
                <p className="stat-value">{stats.todayReservations}</p>
                <p className="stat-change">Reservas programadas</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Stats para Usuario Regular */}
            <div className="stat-card stat-my-reservations">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Mis Reservaciones</p>
                <p className="stat-value">{stats.myReservations}</p>
                <p className="stat-change">Total de reservaciones</p>
              </div>
            </div>

            <div className="stat-card stat-upcoming">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Próximas</p>
                <p className="stat-value">{stats.upcomingReservations}</p>
                <p className="stat-change">Reservaciones futuras</p>
              </div>
            </div>

            <div className="stat-card stat-past">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Completadas</p>
                <p className="stat-value">{stats.pastReservations}</p>
                <p className="stat-change">Reservaciones pasadas</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3 className="section-title">Acciones Rápidas</h3>
        
        {isAdmin ? (
          // Admin Actions
          <div className="actions-grid">
            <button 
              className="action-card action-users"
              onClick={() => navigateTo('/admin/users')}
            >
              <div className="action-icon-wrapper">
                <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="action-content">
                <h4 className="action-title">Gestión de Usuarios</h4>
                <p className="action-description">Administra usuarios del sistema</p>
              </div>
              <div className="action-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button 
              className="action-card action-reservations"
              onClick={() => navigateTo('/admin/reservations')}
            >
              <div className="action-icon-wrapper">
                <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="action-content">
                <h4 className="action-title">Gestión de Reservaciones</h4>
                <p className="action-description">Aprobar, rechazar y gestionar reservaciones</p>
              </div>
              <div className="action-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button 
              className="action-card action-stats"
              onClick={() => navigateTo('/statistics')}
            >
              <div className="action-icon-wrapper">
                <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="action-content">
                <h4 className="action-title">Estadísticas</h4>
                <p className="action-description">Ver reportes y análisis del sistema</p>
              </div>
              <div className="action-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        ) : (
          // User Actions
          <div className="actions-grid">
            <button 
              className="action-card action-my-reservations"
              onClick={() => navigateTo('/reservations')}
            >
              <div className="action-icon-wrapper">
                <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="action-content">
                <h4 className="action-title">Mis Reservaciones</h4>
                <p className="action-description">Ver y gestionar mis reservaciones</p>
              </div>
              <div className="action-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button 
              className="action-card action-new-reservation"
              onClick={() => navigateTo('/new')}
            >
              <div className="action-icon-wrapper">
                <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="action-content">
                <h4 className="action-title">Nueva Reservación</h4>
                <p className="action-description">Crear una nueva reservación</p>
              </div>
              <div className="action-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button 
              className="action-card action-profile"
              onClick={() => navigateTo('/profile')}
            >
              <div className="action-icon-wrapper">
                <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="action-content">
                <h4 className="action-title">Mi Perfil</h4>
                <p className="action-description">Ver y editar mi información</p>
              </div>
              <div className="action-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button 
              className="action-card action-stats"
              onClick={() => navigateTo('/statistics')}
            >
              <div className="action-icon-wrapper">
                <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="action-content">
                <h4 className="action-title">Estadísticas</h4>
                <p className="action-description">Ver mis estadísticas de reservaciones</p>
              </div>
              <div className="action-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Recent Activity - Solo para Admin */}
      {isAdmin && (
        <div className="recent-activity-section">
          <h3 className="section-title">Actividad Reciente</h3>
          <div className="activity-card">
            <div className="activity-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="activity-content">
              <p className="activity-text">
                Sistema funcionando correctamente - Todas las funciones operativas
              </p>
              <p className="activity-time">Última actualización: hace unos momentos</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default MainDashboard;