import { useState, useEffect } from "react";
import "../style-sheets/Admin_reservations.css";

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [viewMode, setViewMode] = useState('all'); // 'all', 'day', 'week'
  const [stats, setStats] = useState({     
    todayReservations: 0,
    weekReservations: 0,
    monthReservations: 0,
    availableTables: 0
  });
     
  const daysOfWeek = [
    { name: "Domingo", short: "Dom", index: 0 },
    { name: "Lunes", short: "Lun", index: 1 },
    { name: "Martes", short: "Mar", index: 2 },
    { name: "Miércoles", short: "Mié", index: 3 },
    { name: "Jueves", short: "Jue", index: 4 },
    { name: "Viernes", short: "Vie", index: 5 },
    { name: "Sábado", short: "Sáb", index: 6 }
  ];

  useEffect(() => {
    fetchAllReservations();
    fetchStats();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [searchTerm, filterStatus, reservations, viewMode, selectedDay]);

  const fetchAllReservations = async () => {
    try {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No has iniciado sesión');
        return;
      }

      const response = await fetch('http://localhost:5100/bread_network/reservations/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener reservaciones');
      }

      const data = await response.json();
      
      // Ordenar por fecha más reciente primero
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setReservations(sortedData);
      setFilteredReservations(sortedData);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error al cargar reservaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5100/bread_network/reservations/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }

    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filterReservations = () => {
    let filtered = reservations;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tableNumber.toString().includes(searchTerm)
      );
    }

    // Filtrar por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }

    // Filtrar por vista (día/semana)
    if (viewMode === 'day') {
      filtered = filtered.filter(r => {
        const resDate = new Date(r.date);
        return resDate.getDay() === selectedDay;
      });
    } else if (viewMode === 'week') {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);

      filtered = filtered.filter(r => {
        const resDate = new Date(r.date);
        return resDate >= startOfWeek && resDate < endOfWeek;
      });
    }

    setFilteredReservations(filtered);
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5100/bread_network/reservations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'confirmed' })
      });

      if (!response.ok) {
        throw new Error('Error al aprobar reservación');
      }

      alert('Reservación aprobada exitosamente');
      fetchAllReservations();
      fetchStats();

    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al aprobar reservación');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres rechazar esta reservación?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5100/bread_network/reservations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) {
        throw new Error('Error al rechazar reservación');
      }

      alert('Reservación rechazada');
      fetchAllReservations();
      fetchStats();

    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al rechazar reservación');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta reservación? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5100/bread_network/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar reservación');
      }

      alert('Reservación eliminada exitosamente');
      fetchAllReservations();
      fetchStats();

    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al eliminar reservación');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pendiente', class: 'status-pending' },
      confirmed: { text: 'Confirmada', class: 'status-confirmed' },
      cancelled: { text: 'Cancelada', class: 'status-cancelled' },
      completed: { text: 'Completada', class: 'status-completed' }
    };
    return badges[status] || badges.pending;
  };

  const getPendingCount = () => {
    return reservations.filter(r => r.status === 'pending').length;
  };

  const getConfirmedCount = () => {
    return reservations.filter(r => r.status === 'confirmed').length;
  };

  const getCancelledCount = () => {
    return reservations.filter(r => r.status === 'cancelled').length;
  };

  return (
    <div className="admin-reservations-container">
      
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <div className="header-icon-circle">
            <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h1 className="page-title">Gestión de Reservaciones</h1>
            <p className="page-subtitle">Administra todas las solicitudes de reservaciones</p>
          </div>
        </div>
        <button className="back-btn" onClick={() => window.location.href = '/dashboard'}>
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-today">
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Hoy</p>
            <p className="stat-value">{stats.todayReservations}</p>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Pendientes</p>
            <p className="stat-value">{getPendingCount()}</p>
          </div>
        </div>

        <div className="stat-card stat-confirmed">
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Confirmadas</p>
            <p className="stat-value">{getConfirmedCount()}</p>
          </div>
        </div>

        <div className="stat-card stat-tables">
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Mesas Disponibles</p>
            <p className="stat-value">{stats.availableTables}</p>
          </div>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="view-mode-section">
        <div className="view-mode-buttons">
          <button 
            className={`view-mode-btn ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            <svg className="view-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Todas
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'day' ? 'active' : ''}`}
            onClick={() => setViewMode('day')}
          >
            <svg className="view-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Por Día
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'week' ? 'active' : ''}`}
            onClick={() => setViewMode('week')}
          >
            <svg className="view-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Esta Semana
          </button>
        </div>
      </div>

      {/* Day Selector (only visible when viewMode is 'day') */}
      {viewMode === 'day' && (
        <div className="week-section">
          <h3 className="section-title">Selecciona un día</h3>
          <div className="week-selector">
            {daysOfWeek.map((day) => (
              <button
                key={day.index}
                className={`day-btn ${selectedDay === day.index ? 'active' : ''}`}
                onClick={() => setSelectedDay(day.index)}
              >
                <span className="day-short">{day.short}</span>
                <span className="day-count">
                  {reservations.filter(r => new Date(r.date).getDay() === day.index).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="controls-section">
        <div className="search-box">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, email o número de mesa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Todas
            <span className="filter-count">{reservations.length}</span>
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pendientes
            <span className="filter-count">{getPendingCount()}</span>
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('confirmed')}
          >
            Confirmadas
            <span className="filter-count">{getConfirmedCount()}</span>
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilterStatus('cancelled')}
          >
            Canceladas
            <span className="filter-count">{getCancelledCount()}</span>
          </button>
        </div>
      </div>

      {/* Reservations Content */}
      <div className="reservations-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando reservaciones...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="error-text">{error}</p>
            <button className="retry-btn" onClick={fetchAllReservations}>
              Reintentar
            </button>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="empty-text">No se encontraron reservaciones</p>
          </div>
        ) : (
          <div className="reservations-grid">
            {filteredReservations.map((reservation) => {
              const statusBadge = getStatusBadge(reservation.status);
              const isPast = new Date(reservation.date) < new Date();
              const isPending = reservation.status === 'pending';
              
              return (
                <div key={reservation._id} className="reservation-card">
                  <div className="card-header">
                    <div className="date-badge">
                      <svg className="calendar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(reservation.date)}</span>
                    </div>
                    <span className={`status-badge ${statusBadge.class}`}>
                      {statusBadge.text}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="customer-info">
                      <h3 className="customer-name">{reservation.customerName}</h3>
                      <p className="customer-email">{reservation.customerEmail}</p>
                      {reservation.customerPhone && (
                        <p className="customer-phone">{reservation.customerPhone}</p>
                      )}
                    </div>

                    {reservation.userId && (
                      <div className="user-info-badge">
                        <svg className="user-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Usuario ID: {reservation.userId._id || reservation.userId}</span>
                      </div>
                    )}

                    <div className="reservation-details">
                      <div className="detail-row">
                        <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="detail-text">{reservation.time}</span>
                      </div>

                      <div className="detail-row">
                        <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span className="detail-text">Mesa {reservation.tableNumber}</span>
                      </div>

                      <div className="detail-row">
                        <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="detail-text">{reservation.numberOfGuests} {reservation.numberOfGuests === 1 ? 'persona' : 'personas'}</span>
                      </div>
                    </div>

                    {reservation.specialRequests && (
                      <div className="special-requests">
                        <p className="requests-label">Solicitudes especiales:</p>
                        <p className="requests-text">{reservation.specialRequests}</p>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    {isPending && !isPast && (
                      <>
                        <button 
                          className="action-btn btn-approve"
                          onClick={() => handleApprove(reservation._id)}
                          title="Aprobar reservación"
                        >
                          <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Aprobar
                        </button>
                        <button 
                          className="action-btn btn-reject"
                          onClick={() => handleReject(reservation._id)}
                          title="Rechazar reservación"
                        >
                          <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Rechazar
                        </button>
                      </>
                    )}
                    <button 
                      className="action-btn btn-delete"
                      onClick={() => handleDelete(reservation._id)}
                      title="Eliminar reservación"
                    >
                      <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                    <button 
                      className="action-btn btn-details"
                      onClick={() => alert(`Ver detalles de reservación ${reservation._id}`)}
                      title="Ver detalles"
                    >
                      <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Detalles
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReservations;