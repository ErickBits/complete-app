import { useState, useEffect } from "react";
import "../style-sheets/Reservations.css";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // Obtener reservaciones al cargar el componente
  useEffect(() => {
    fetchMyReservations();
  }, []);

  // Filtrar reservaciones cuando cambia el filtro
  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredReservations(reservations);
    } else {
      setFilteredReservations(
        reservations.filter(r => r.status === filterStatus)
      );
    }
  }, [filterStatus, reservations]);

  const fetchMyReservations = async () => {
    try {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No has iniciado sesión');
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5100/bread_network/reservations/my-reservations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener las reservaciones');
      }

      const data = await response.json();
      
      // Ordenar por fecha más reciente primero
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setReservations(sortedData);
      setFilteredReservations(sortedData);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error al cargar las reservaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta reservación?')) {
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
        throw new Error('Error al cancelar la reservación');
      }

      // Actualizar la lista
      fetchMyReservations();
      alert('Reservación cancelada exitosamente');

    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al cancelar la reservación');
    }
  };

  const handleDeleteReservation = async (id) => {
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
        throw new Error('Error al eliminar la reservación');
      }

      // Actualizar la lista
      fetchMyReservations();
      alert('Reservación eliminada exitosamente');

    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al eliminar la reservación');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const formatTime = (time) => {
    return time;
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

  const getUpcomingReservations = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservations.filter(r => 
      new Date(r.date) >= today && 
      (r.status === 'pending' || r.status === 'confirmed')
    ).length;
  };

  const getPastReservations = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservations.filter(r => new Date(r.date) < today).length;
  };

  const getCancelledReservations = () => {
    return reservations.filter(r => r.status === 'cancelled').length;
  };

  return (
    <div className="my-reservations-container">
      
      {/* Header */}
      <div className="reservations-header">
        <div className="header-content">
          <div className="header-icon-circle">
            <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="page-title">Mis Reservaciones</h1>
            <p className="page-subtitle">Gestiona todas tus reservaciones de restaurante</p>
          </div>
        </div>
        <button className="new-reservation-btn" onClick={() => window.location.href = '/dashboard'}>
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Reservación
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-upcoming">
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Próximas</p>
            <p className="stat-value">{getUpcomingReservations()}</p>
          </div>
        </div>

        <div className="stat-card stat-past">
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Pasadas</p>
            <p className="stat-value">{getPastReservations()}</p>
          </div>
        </div>

        <div className="stat-card stat-cancelled">
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Canceladas</p>
            <p className="stat-value">{getCancelledReservations()}</p>
          </div>
        </div>

        <div className="stat-card stat-total">
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total</p>
            <p className="stat-value">{reservations.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-container">
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
            <span className="filter-count">
              {reservations.filter(r => r.status === 'pending').length}
            </span>
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('confirmed')}
          >
            Confirmadas
            <span className="filter-count">
              {reservations.filter(r => r.status === 'confirmed').length}
            </span>
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilterStatus('cancelled')}
          >
            Canceladas
            <span className="filter-count">
              {reservations.filter(r => r.status === 'cancelled').length}
            </span>
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completadas
            <span className="filter-count">
              {reservations.filter(r => r.status === 'completed').length}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="reservations-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando tus reservaciones...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="error-text">{error}</p>
            <button className="retry-btn" onClick={fetchMyReservations}>
              Reintentar
            </button>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="empty-text">
              {filterStatus === 'all' 
                ? 'No tienes reservaciones aún' 
                : `No tienes reservaciones ${getStatusBadge(filterStatus).text.toLowerCase()}`}
            </p>
            <button className="empty-action-btn" onClick={() => window.location.href = '/dashboard'}>
              Crear tu primera reservación
            </button>
          </div>
        ) : (
          <div className="reservations-grid">
            {filteredReservations.map((reservation) => {
              const statusBadge = getStatusBadge(reservation.status);
              const isPast = new Date(reservation.date) < new Date();
              
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

                    <div className="reservation-details">
                      <div className="detail-row">
                        <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="detail-text">{formatTime(reservation.time)}</span>
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
                    {!isPast && reservation.status !== 'cancelled' && (
                      <>
                        <button 
                          className="action-btn btn-cancel"
                          onClick={() => handleCancelReservation(reservation._id)}
                          title="Cancelar reservación"
                        >
                          <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancelar
                        </button>
                      </>
                    )}
                    <button 
                      className="action-btn btn-delete"
                      onClick={() => handleDeleteReservation(reservation._id)}
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

export default MyReservations;