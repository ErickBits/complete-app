import { useState, useEffect, useCallback } from "react";
import "../style-sheets/dashboard.css";

// ─────────────────────────────────────────────
// API SERVICE — centraliza todas las llamadas
// ─────────────────────────────────────────────
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5100/bread_network/reservations";

// Parsea la respuesta de forma segura: si el servidor devuelve HTML (404, 500, etc.)
// en lugar de JSON, lanza un error legible en vez de crashear
async function safeJson(res) {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (!res.ok) throw new Error(data?.message || data?.error || `Error ${res.status}`);
    return data;
  } catch (e) {
    if (e.message.startsWith("Error ")) throw e;
    throw new Error(`Error ${res.status}: el servidor no devolvió JSON válido`);
  }
}

const api = {
  headers: () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }),

  getStats: ()         => fetch(`${BASE_URL}/stats`,            { headers: api.headers() }).then(safeJson),
  getWeekReservations: () => fetch(`${BASE_URL}/week`,          { headers: api.headers() }).then(safeJson),
  getByDay: (date)     => fetch(`${BASE_URL}/day/${date}`,      { headers: api.headers() }).then(safeJson),
  getAll: ()           => fetch(`${BASE_URL}/all`,              { headers: api.headers() }).then(safeJson),
  getMyReservations: () => fetch(`${BASE_URL}/my-reservations`, { headers: api.headers() }).then(safeJson),
  getById: (id)        => fetch(`${BASE_URL}/${id}`,            { headers: api.headers() }).then(safeJson),

  create: (data) =>
    fetch(`${BASE_URL}/create`, {
      method: "POST",
      headers: api.headers(),
      body: JSON.stringify(data),
    }).then(safeJson),

  update: (id, data) =>
    fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: api.headers(),
      body: JSON.stringify(data),
    }).then(safeJson),

  updateStatus: (id, status) =>
    fetch(`${BASE_URL}/${id}/status`, {
      method: "PATCH",
      headers: api.headers(),
      body: JSON.stringify({ status }),
    }).then(safeJson),

  delete: (id) =>
    fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: api.headers(),
    }).then(safeJson),
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const todayISO = () => new Date().toISOString().split("T")[0];

const daysOfWeek = [
  { name: "Domingo",   short: "Dom", index: 0 },
  { name: "Lunes",     short: "Lun", index: 1 },
  { name: "Martes",    short: "Mar", index: 2 },
  { name: "Miércoles", short: "Mié", index: 3 },
  { name: "Jueves",    short: "Jue", index: 4 },
  { name: "Viernes",   short: "Vie", index: 5 },
  { name: "Sábado",    short: "Sáb", index: 6 },
];

// Clase CSS para cada estado del select
const statusClass = {
  confirmed: "status-select--confirmed",
  pending:   "status-select--pending",
  cancelled: "status-select--cancelled",
};

function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// MODAL: CREAR / EDITAR RESERVACIÓN
// ─────────────────────────────────────────────
function ReservationModal({ reservation, onClose, onSave }) {
  const isEdit = !!(reservation?._id || reservation?.id);
  const [form, setForm] = useState({
    customerName:    reservation?.customerName    || "",
    customerEmail:   reservation?.customerEmail   || "",
    customerPhone:   reservation?.customerPhone   || "",
    tableNumber:     reservation?.tableNumber     || "",
    numberOfGuests:  reservation?.numberOfGuests  || 1,
    date:            reservation?.date            || todayISO(),
    time:            reservation?.time            || "",
    specialRequests: reservation?.specialRequests || "",
    status:          reservation?.status          || "pending",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const result = isEdit
        ? await api.update(reservation._id || reservation.id, form)
        : await api.create(form);
      if (result.error) throw new Error(result.error);
      onSave(result);
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? "Editar Reservación" : "Nueva Reservación"}
          </h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="error-msg">{error}</p>}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombre del cliente</label>
              <input
                className="form-input"
                value={form.customerName}
                onChange={e => setForm({ ...form, customerName: e.target.value })}
                placeholder="Ej: María García"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={form.customerEmail}
                onChange={e => setForm({ ...form, customerEmail: e.target.value })}
                placeholder="Ej: maria@email.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                className="form-input"
                type="tel"
                value={form.customerPhone}
                onChange={e => setForm({ ...form, customerPhone: e.target.value })}
                placeholder="Ej: 555-1234"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mesa N°</label>
              <input
                className="form-input"
                type="number"
                min="1"
                value={form.tableNumber}
                onChange={e => setForm({ ...form, tableNumber: e.target.value })}
                placeholder="Ej: 5"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha</label>
              <input
                className="form-input"
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hora</label>
              <input
                className="form-input"
                type="time"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">N° de personas</label>
              <input
                className="form-input"
                type="number"
                min="1"
                max="20"
                value={form.numberOfGuests}
                onChange={e => setForm({ ...form, numberOfGuests: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Solicitudes especiales</label>
              <input
                className="form-input"
                value={form.specialRequests}
                onChange={e => setForm({ ...form, specialRequests: e.target.value })}
                placeholder="Ej: mesa sin ruido, silla para bebé..."
              />
            </div>

            {isEdit && (
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-input"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear reservación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MODAL: CONFIRMAR ELIMINACIÓN
// ─────────────────────────────────────────────
function DeleteModal({ reservation, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onConfirm(reservation._id || reservation.id);
    setDeleting(false);
  };

  return (
    <div className="overlay">
      <div className="modal modal--sm">
        <div className="modal-header">
          <h2 className="modal-title modal-title--danger">Eliminar Reservación</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <p className="delete-description">
          ¿Estás seguro de eliminar la reservación de{" "}
          <strong>{reservation.name}</strong> — Mesa {reservation.table}?
        </p>
        <p className="delete-warning">
          Esta acción no se puede deshacer.
        </p>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleDelete} className="btn-danger" disabled={deleting}>
            {deleting ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CARD DE RESERVACIÓN
// ─────────────────────────────────────────────
function ReservationCard({ reservation, isAdmin, onEdit, onDelete, onStatusChange }) {
  const [changingStatus, setChangingStatus] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setChangingStatus(true);
    await onStatusChange(reservation._id || reservation.id, newStatus);
    setChangingStatus(false);
  };

  return (
    <div className="reservation-card">
      <div className="card-header">
        <span className="table-badge">Mesa {reservation.tableNumber}</span>
        <select
          value={reservation.status}
          onChange={e => handleStatusChange(e.target.value)}
          disabled={changingStatus}
          className={`status-select ${statusClass[reservation.status] || statusClass.pending}`}
        >
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmada</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>

      <div className="card-body">
        <div className="card-info">
          <div className="info-row">
            <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="info-text">{reservation.customerName}</span>
          </div>

          <div className="info-row">
            <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="info-text">{reservation.time}</span>
          </div>

          <div className="info-row">
            <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="info-text">
              {reservation.numberOfGuests} persona{reservation.numberOfGuests !== 1 ? "s" : ""}
            </span>
          </div>

          {reservation.customerPhone && (
            <div className="info-row">
              <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="info-text">{reservation.customerPhone}</span>
            </div>
          )}

          {reservation.tableNumber && (
            <div className="info-row">
              <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              </svg>
              <span className="info-text">Mesa {reservation.tableNumber}</span>
            </div>
          )}

          {isAdmin && reservation.userId?.name && (
            <div className="info-row">
              <span className="admin-user-badge">👤 {reservation.userId.name}</span>
            </div>
          )}
        </div>

        <div className="card-actions">
          <button onClick={() => onEdit(reservation)} className="btn-edit" title="Editar">
            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => onDelete(reservation)} className="btn-delete" title="Eliminar">
            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VISTA ADMIN: TODAS LAS RESERVACIONES
// ─────────────────────────────────────────────
function AllReservationsView({ onEdit, onDelete, onStatusChange }) {
  const [all,     setAll]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAll()
      .then(data => setAll(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="empty-state">
      <div className="spinner" />
      <p className="empty-text">Cargando todas las reservaciones...</p>
    </div>
  );

  return (
    <div className="reservations-section">
      <div className="section-header">
        <h2 className="section-title">Todas las Reservaciones</h2>
        <span className="count-badge">{all.length} total</span>
      </div>
      <div className="reservations-list">
        {all.map(r => (
          <ReservationCard
            key={r.id}
            reservation={r}
            isAdmin={true}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
function Dashboard() {
  const user    = getUserFromToken();
  const isAdmin = user?.role === "admin";

  const [selectedDay,         setSelectedDay]        = useState(new Date().getDay());
  const [selectedDate,        setSelectedDate]        = useState(todayISO());
  const [reservations,        setReservations]        = useState([]);
  const [weekReservations,    setWeekReservations]    = useState([]);
  const [stats,               setStats]              = useState({
    totalReservations: 0, availableTables: 0, todayReservations: 0, weekReservations: 0,
  });
  const [isLoading,           setIsLoading]           = useState(true);
  const [toast,               setToast]               = useState(null);
  const [showCreateModal,     setShowCreateModal]     = useState(false);
  const [editingReservation,  setEditingReservation]  = useState(null);
  const [deletingReservation, setDeletingReservation] = useState(null);
  const [activeTab,           setActiveTab]           = useState("week");

  // ── Toast ─────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Cargar datos ──────────────────────────────
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsData, weekData] = await Promise.all([
        api.getStats(),
        api.getWeekReservations(),
      ]);
      setStats(statsData);
      setWeekReservations(weekData);
      const dayData = await api.getByDay(selectedDate);
      setReservations(Array.isArray(dayData) ? dayData : []);
    } catch {
      showToast("Error al cargar los datos", "error");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Cambiar día ───────────────────────────────
  const handleDayChange = async (dayIndex) => {
    setSelectedDay(dayIndex);
    const today     = new Date();
    const diff      = dayIndex - today.getDay();
    const targetDay = new Date(today);
    targetDay.setDate(today.getDate() + diff);
    const dateStr = targetDay.toISOString().split("T")[0];
    setSelectedDate(dateStr);
    try {
      const data = await api.getByDay(dateStr);
      setReservations(Array.isArray(data) ? data : []);
    } catch {
      showToast("Error al obtener reservaciones del día", "error");
    }
  };

  // ── CRUD handlers ─────────────────────────────
  const handleSaveReservation = async () => {
    showToast(
      editingReservation
        ? "Reservación actualizada correctamente"
        : "Reservación creada correctamente"
    );
    setShowCreateModal(false);
    setEditingReservation(null);
    await loadData();
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await api.delete(id);  // id viene de reservation._id || reservation.id
      showToast("Reservación eliminada");
      setDeletingReservation(null);
      await loadData();
    } catch {
      showToast("Error al eliminar", "error");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateStatus(id, newStatus);  // id ya viene como _id desde la card
      showToast("Estado actualizado");
      setReservations(prev =>
        prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
      );
    } catch {
      showToast("Error al cambiar estado", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/SignUp";
  };

  const countForDay = (dayIndex) =>
    weekReservations.filter(r => new Date(r.date).getDay() === dayIndex).length;

  const statsCards = [
    { label: "Hoy",           value: stats.todayReservations, change: "+12% vs ayer",         color: "indigo" },
    { label: "Esta semana",   value: stats.weekReservations,  change: "+8% vs semana pasada", color: "green"  },
    { label: "Mesas libres",  value: stats.availableTables,   change: "de 12 totales",        color: "amber"  },
    { label: "Total del mes", value: stats.totalReservations, change: "+24% vs mes pasado",   color: "blue"   },
  ];

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <div className="layout">

      {/* Toast */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="logo-text">Bread Network</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {[
            { label: "Dashboard",     icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { label: "Reservaciones", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { label: "Mesas",         icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
            { label: "Clientes",      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
            { label: "Estadísticas",  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
          ].map(item => (
            <a key={item.label} href="/" className="nav-item">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          {isAdmin && (
            <div className="admin-badge-wrapper">
              <span className="admin-role-badge">⚡ Admin</span>
            </div>
          )}
          <div className="user-info">
            <div className="avatar">
              {(user?.name || "U")[0].toUpperCase()}
            </div>
            <div>
              <p className="user-name">{user?.name || "Usuario"}</p>
              <p className="user-email">{user?.email || ""}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main">

        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1 className="page-title">
              {isAdmin ? "Panel de Administrador" : `Bienvenido, ${user?.name}`}
            </h1>
            <p className="page-subtitle">
              {isAdmin
                ? "Gestiona todas las reservaciones del sistema"
                : "Aquí está el resumen de tus reservaciones"}
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            + Nueva Reservación
          </button>
        </header>

        {/* Stats */}
        <div className="stats-grid">
          {statsCards.map(s => (
            <div key={s.label} className={`stat-card stat-card--${s.color}`}>
              <p className={`stat-label stat-label--${s.color}`}>{s.label}</p>
              <p className="stat-value">{s.value}</p>
              <p className="stat-change">{s.change}</p>
            </div>
          ))}
        </div>

        {/* Tabs admin */}
        {isAdmin && (
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === "week" ? "tab-btn--active" : "tab-btn--inactive"}`}
              onClick={() => setActiveTab("week")}
            >
              📅 Vista semanal
            </button>
            <button
              className={`tab-btn ${activeTab === "all" ? "tab-btn--active" : "tab-btn--inactive"}`}
              onClick={() => setActiveTab("all")}
            >
              📋 Todas las reservaciones
            </button>
          </div>
        )}

        {activeTab === "all" && isAdmin ? (
          <AllReservationsView
            onEdit={setEditingReservation}
            onDelete={setDeletingReservation}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <>
            {/* Selector de días */}
            <div className="week-section">
              <h2 className="section-title">Reservaciones de la Semana</h2>
              <div className="week-selector">
                {daysOfWeek.map(day => (
                  <button
                    key={day.index}
                    className={`day-btn ${selectedDay === day.index ? "day-btn--active" : ""}`}
                    onClick={() => handleDayChange(day.index)}
                  >
                    <span className="day-short">{day.short}</span>
                    <span className="day-count">{countForDay(day.index)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lista del día */}
            <div className="reservations-section">
              <div className="section-header">
                <h2 className="section-title">
                  {daysOfWeek[selectedDay].name}
                </h2>
                <span className="count-badge">
                  {reservations.length} reservación{reservations.length !== 1 ? "es" : ""}
                </span>
              </div>

              {isLoading ? (
                <div className="empty-state">
                  <div className="spinner" />
                  <p className="empty-text">Cargando...</p>
                </div>
              ) : reservations.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-text">No hay reservaciones para este día</p>
                  <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                    Crear reservación
                  </button>
                </div>
              ) : (
                <div className="reservations-list">
                  {reservations.map(r => (
                    <ReservationCard
                      key={r.id}
                      reservation={r}
                      isAdmin={isAdmin}
                      onEdit={setEditingReservation}
                      onDelete={setDeletingReservation}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ── MODALES ── */}
      {showCreateModal && (
        <ReservationModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveReservation}
        />
      )}
      {editingReservation && (
        <ReservationModal
          reservation={editingReservation}
          onClose={() => setEditingReservation(null)}
          onSave={handleSaveReservation}
        />
      )}
      {deletingReservation && (
        <DeleteModal
          reservation={deletingReservation}
          onClose={() => setDeletingReservation(null)} 
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>     
  );
}

export default Dashboard;