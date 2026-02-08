import { useState, useEffect } from "react";
import "../style-sheets/dashboard.css";

function Dashboard() {
  const [user, setUser] = useState({ name: "Juan", email: "juan@ejemplo.com" });
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({
    totalReservations: 0,
    availableTables: 0,
    todayReservations: 0,
    weekReservations: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showNewReservation, setShowNewReservation] = useState(false);

  const daysOfWeek = [
    { name: "Domingo", short: "Dom", index: 0 },
    { name: "Lunes", short: "Lun", index: 1 },
    { name: "Martes", short: "Mar", index: 2 },
    { name: "Miércoles", short: "Mié", index: 3 },
    { name: "Jueves", short: "Jue", index: 4 },
    { name: "Viernes", short: "Vie", index: 5 },
    { name: "Sábado", short: "Sáb", index: 6 }
  ];

  // Datos de ejemplo - reemplazar con API real
  useEffect(() => {
    setTimeout(() => {
      setReservations([
        { id: 1, table: 5, time: "12:00 PM", guests: 4, name: "María García", status: "confirmed", day: 1 },
        { id: 2, table: 3, time: "1:30 PM", guests: 2, name: "Carlos Ruiz", status: "pending", day: 1 },
        { id: 3, table: 8, time: "7:00 PM", guests: 6, name: "Ana Martínez", status: "confirmed", day: 2 },
        { id: 4, table: 2, time: "8:30 PM", guests: 3, name: "Pedro López", status: "confirmed", day: 3 },
        { id: 5, table: 10, time: "6:00 PM", guests: 8, name: "Sofía Hernández", status: "pending", day: 4 },
        { id: 6, table: 1, time: "12:30 PM", guests: 2, name: "Luis Gómez", status: "confirmed", day: 5 },
        { id: 7, table: 7, time: "9:00 PM", guests: 4, name: "Carmen Díaz", status: "confirmed", day: 6 }
      ]);
      
      setStats({
        totalReservations: 24,
        availableTables: 8,
        todayReservations: 5,
        weekReservations: 18
      });
      
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredReservations = reservations.filter(r => r.day === selectedDay);

  const getStatusColor = (status) => {
    return status === 'confirmed' ? 'status-confirmed' : 'status-pending';
  };

  const getStatusText = (status) => {
    return status === 'confirmed' ? 'Confirmada' : 'Pendiente';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="logo-text">Bread Network</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </a>
          
          <a href="#" className="nav-item">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Reservaciones
          </a>
          
          <a href="#" className="nav-item">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Mesas
          </a>
          
          <a href="#" className="nav-item">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Clientes
          </a>
          
          <a href="#" className="nav-item">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Estadísticas
          </a>
        </nav>

        <div className="sidebar-footer">
          <a href="/update" className="nav-item">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configuración
          </a>
          
          <button onClick={handleLogout} className="nav-item logout-btn">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1 className="page-title">Bienvenido, {user.name}</h1>
            <p className="page-subtitle">Aquí está el resumen de tus reservaciones</p>
          </div>
          
          <button 
            className="new-reservation-btn"
            onClick={() => setShowNewReservation(true)}
          >
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Reservación
          </button>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon-wrapper stat-icon-primary">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Hoy</p>
              <p className="stat-value">{stats.todayReservations}</p>
              <p className="stat-change positive">+12% vs ayer</p>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon-wrapper stat-icon-success">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Esta Semana</p>
              <p className="stat-value">{stats.weekReservations}</p>
              <p className="stat-change positive">+8% vs semana pasada</p>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon-wrapper stat-icon-warning">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Mesas Disponibles</p>
              <p className="stat-value">{stats.availableTables}</p>
              <p className="stat-change neutral">de 12 totales</p>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon-wrapper stat-icon-info">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Mes</p>
              <p className="stat-value">{stats.totalReservations}</p>
              <p className="stat-change positive">+24% vs mes pasado</p>
            </div>
          </div>
        </div>

        {/* Week Selector */}
        <div className="week-section">
          <h2 className="section-title">Reservaciones de la Semana</h2>
          <div className="week-selector">
            {daysOfWeek.map((day) => (
              <button
                key={day.index}
                className={`day-btn ${selectedDay === day.index ? 'active' : ''}`}
                onClick={() => setSelectedDay(day.index)}
              >
                <span className="day-short">{day.short}</span>
                <span className="day-count">
                  {reservations.filter(r => r.day === day.index).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Reservations List */}
        <div className="reservations-section">
          <div className="section-header">
            <h2 className="section-title">
              {daysOfWeek[selectedDay].name}
            </h2>
            <span className="reservations-count">
              {filteredReservations.length} reservación{filteredReservations.length !== 1 ? 'es' : ''}
            </span>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando reservaciones...</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="empty-text">No hay reservaciones para este día</p>
              <button className="empty-action-btn" onClick={() => setShowNewReservation(true)}>
                Crear nueva reservación
              </button>
            </div>
          ) : (
            <div className="reservations-list">
              {filteredReservations.map((reservation) => (
                <div key={reservation.id} className="reservation-card">
                  <div className="reservation-header">
                    <div className="table-badge">
                      Mesa {reservation.table}
                    </div>
                    <span className={`status-badge ${getStatusColor(reservation.status)}`}>
                      {getStatusText(reservation.status)}
                    </span>
                  </div>
                  
                  <div className="reservation-body">
                    <div className="reservation-info">
                      <div className="info-row">
                        <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="info-text">{reservation.name}</span>
                      </div>
                      
                      <div className="info-row">
                        <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="info-text">{reservation.time}</span>
                      </div>
                      
                      <div className="info-row">
                        <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="info-text">{reservation.guests} persona{reservation.guests !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="reservation-actions">
                      <button className="action-btn action-edit">
                        <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="action-btn action-delete">
                        <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;