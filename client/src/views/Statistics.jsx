import { useState, useEffect } from "react";
import "../style-sheets/statistics.css";

function Statistics() {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
    
    const [stats, setStats] = useState({
        // Admin stats
        totalUsers: 0,
        totalReservations: 0,
        pendingReservations: 0,
        confirmedReservations: 0,
        cancelledReservations: 0,
        completedReservations: 0,
        todayReservations: 0,
        weekReservations: 0,
        monthReservations: 0,
        // User stats
        myReservations: 0,
        upcomingReservations: 0,
        pastReservations: 0,
        cancelledByMe: 0
    });

    const [reservationsByDay, setReservationsByDay] = useState([]);
    const [reservationsByStatus, setReservationsByStatus] = useState([]);
    const [topTables, setTopTables] = useState([]);
    const [monthlyTrend, setMonthlyTrend] = useState([]);

    useEffect(() => {
        fetchUserData();
        fetchStatistics();
    }, [timeRange]);

    const fetchUserData = async () => {
        try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            window.location.href = '/SignUp';
            return;
        }

        // Decodificar token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decoded = JSON.parse(jsonPayload);
        setIsAdmin(decoded.role === 'admin');

        // Obtener perfil
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

    const fetchStatistics = async () => {
    try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        // Decodificar para saber si es admin
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        const userIsAdmin = decoded.role === 'admin';

        // Una sola llamada para ambos tipos de usuario
        const statsRes = await fetch('http://localhost:5100/bread_network/reservations/statistics', {
        headers: { 'Authorization': `Bearer ${token}` }
        });

        if (statsRes.ok) {
        const statsData = await statsRes.json();
        
        // Actualizar stats
        setStats(statsData);

        // Procesar datos para gráficos
        if (statsData.reservationsByDay) {
            const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            const maxDay = Math.max(...statsData.reservationsByDay, 1);
            setReservationsByDay(statsData.reservationsByDay.map((count, index) => ({
            day: dayNames[index],
            count,
            percentage: (count / maxDay) * 100
            })));
        }

        if (statsData.monthlyTrend) {
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const maxMonth = Math.max(...statsData.monthlyTrend.map(m => m.count), 1);
            setMonthlyTrend(statsData.monthlyTrend.map(m => ({
            month: monthNames[m.month],
            count: m.count,
            percentage: (m.count / maxMonth) * 100
            })));
        }

        if (userIsAdmin && statsData.topTables) {
            const maxTable = Math.max(...statsData.topTables.map(t => t.count), 1);
            setTopTables(statsData.topTables.map(t => ({
            ...t,
            percentage: (t.count / maxTable) * 100
            })));
        }

        // Distribución por estado
        setReservationsByStatus([
            { status: 'Pendiente', count: statsData.pendingReservations || 0, color: '#f59e0b' },
            { status: 'Confirmada', count: statsData.confirmedReservations || 0, color: '#10b981' },
            { status: 'Cancelada', count: statsData.cancelledReservations || 0, color: '#ef4444' },
            { status: 'Completada', count: statsData.completedReservations || 0, color: '#8b5cf6' }
        ]);
        }

    } catch (error) {
        console.error('Error:', error);
        setError('Error al cargar estadísticas');
    } finally {
        setIsLoading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="statistics-loading">
        <div className="spinner"></div>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      
      {/* Header */}
      <div className="statistics-header">
        <div className="header-content">
          <div className="header-icon-circle">
            <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="page-title">
              {isAdmin ? 'Estadísticas del Sistema' : 'Mis Estadísticas'}
            </h1>
            <p className="page-subtitle">
              {isAdmin ? 'Análisis y métricas generales' : 'Resumen de tu actividad'}
            </p>
          </div>
        </div>
        <button className="back-btn" onClick={() => window.history.back()}>
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>
      </div>

      {/* Overview Stats */}
      <div className="overview-section">
        <h3 className="section-title">Resumen General</h3>
        <div className="stats-grid">
          {isAdmin ? (
            <>
              <div className="stat-card stat-primary">
                <div className="stat-icon-wrapper">
                  <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total Usuarios</p>
                  <p className="stat-value">{stats.totalUsers}</p>
                </div>
              </div>

              <div className="stat-card stat-success">
                <div className="stat-icon-wrapper">
                  <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total Reservaciones</p>
                  <p className="stat-value">{stats.totalReservations}</p>
                </div>
              </div>

              <div className="stat-card stat-warning">
                <div className="stat-icon-wrapper">
                  <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Pendientes</p>
                  <p className="stat-value">{stats.pendingReservations}</p>
                </div>
              </div>

              <div className="stat-card stat-info">
                <div className="stat-icon-wrapper">
                  <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Confirmadas</p>
                  <p className="stat-value">{stats.confirmedReservations}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="stat-card stat-primary">
                <div className="stat-icon-wrapper">
                  <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total Reservaciones</p>
                  <p className="stat-value">{stats.myReservations}</p>
                </div>
              </div>

              <div className="stat-card stat-success">
                <div className="stat-icon-wrapper">
                  <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Próximas</p>
                  <p className="stat-value">{stats.upcomingReservations}</p>
                </div>
              </div>

              <div className="stat-card stat-info">
                <div className="stat-icon-wrapper">
                  <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Completadas</p>
                  <p className="stat-value">{stats.pastReservations}</p>
                </div>
              </div>

              <div className="stat-card stat-danger">
                <div className="stat-icon-wrapper">
                  <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Canceladas</p>
                  <p className="stat-value">{stats.cancelledByMe}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        
        {/* Reservaciones por Día de la Semana */}
        <div className="chart-card">
          <h3 className="chart-title">Reservaciones por Día de la Semana</h3>
          <div className="bar-chart">
            {reservationsByDay.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-wrapper">
                  <div 
                    className="bar-fill"
                    style={{ height: `${item.percentage}%` }}
                  >
                    <span className="bar-value">{item.count}</span>
                  </div>
                </div>
                <span className="bar-label">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución por Estado */}
        <div className="chart-card">
          <h3 className="chart-title">Distribución por Estado</h3>
          <div className="status-chart">
            {reservationsByStatus.map((item, index) => (
              <div key={index} className="status-item">
                <div className="status-info">
                  <div 
                    className="status-color"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="status-label">{item.status}</span>
                </div>
                <div className="status-bar-wrapper">
                  <div 
                    className="status-bar-fill"
                    style={{ 
                      width: `${(item.count / stats.totalReservations || stats.myReservations) * 100}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
                <span className="status-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tendencia Mensual */}
        <div className="chart-card chart-full">
          <h3 className="chart-title">Tendencia de los Últimos 6 Meses</h3>
          <div className="line-chart">
            {monthlyTrend.map((item, index) => (
              <div key={index} className="line-item">
                <div className="line-wrapper">
                  <div 
                    className="line-fill"
                    style={{ height: `${item.percentage}%` }}
                  >
                    <span className="line-value">{item.count}</span>
                  </div>
                </div>
                <span className="line-label">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Mesas (solo admin) */}
        {isAdmin && topTables.length > 0 && (
          <div className="chart-card">
            <h3 className="chart-title">Mesas Más Reservadas</h3>
            <div className="top-tables">
              {topTables.map((item, index) => (
                <div key={index} className="table-item">
                  <div className="table-info">
                    <span className="table-rank">#{index + 1}</span>
                    <span className="table-number">Mesa {item.table}</span>
                  </div>
                  <div className="table-bar-wrapper">
                    <div 
                      className="table-bar-fill"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="table-count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default Statistics;