// src/components/Profile.jsx
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import "../style-sheets/profile.css"

/**
 * Profile
 * - Obtiene datos del endpoint /profile usando el token en localStorage.
 * - Muestra estado de carga y errores.
 * - Cancela la petición si el componente se desmonta.
 */
export default function Profile({ name, email, lastname }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener datos; acepta una señal AbortController.signal
  const fetchProfile = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró token de autenticación.');
        setLoading(false);
        return null;
      }

      const res = await fetch('http://localhost:5100/bread_network/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal,
      });

      if (!res.ok) {
        // Puedes mapear códigos a mensajes más amigables si lo deseas
        throw new Error(`Error en la respuesta del servidor: ${res.status}`);
      }

      const data = await res.json();
      setUser(data);
      return data;
    } catch (err) {
      // Ignorar abortos (cuando el componente se desmonta)
      if (err.name === 'AbortError') return null;
      console.error('Error en fetchProfile:', err);
      setError(err.message || 'Error desconocido al obtener perfil.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Ejecutar al montar y cancelar al desmontar
  useEffect(() => {
    const controller = new AbortController();
    fetchProfile(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchProfile]);

  // Permite refrescar manualmente los datos
  const handleRefresh = async () => {
    const controller = new AbortController();
    await fetchProfile(controller.signal);
  };

  // dentro del return de Profile.jsx reemplaza el contenido por:
return (
  <div className="profile page">
    <div className="profile-card">
      <aside className="profile-aside">
        <div className="avatar">
          <img src={user?.avatarUrl ?? '/images/default-avatar.jpg'} alt="Avatar" />
        </div>
        <h2 className="profile-name">{user?.name ?? name ?? '—'}</h2>
        <div className="profile-role">{user?.role ?? 'Cliente'}</div>
        <div className="badges">
          <span className="badge">Miembro</span>
          <span className="badge">Activo</span>
        </div>
      </aside>

      <section className="profile-main">
        <div className="header-row">
          <div>
            <h1 className="title">Perfil</h1>
            <div className="subtitle">Información personal y actividad reciente</div>
          </div>
          <div className="actions">
            <button className="btn ghost" onClick={handleRefresh}>Refrescar</button>
            <button className="btn primary">Editar perfil</button>
          </div>
        </div>

        <div className="info-card">
          <div className="info-row">
            <div className="info-label">Nombre</div>
            <div className="info-value">{user?.name ?? name ?? '—'}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Apellido</div>
            <div className="info-value">{user?.lastname ?? lastname ?? '—'}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Email</div>
            <div className="info-value">{user?.email ?? email ?? '—'}</div>
          </div>

          <div className="stats" aria-hidden>
            <div className="stat">
              <div className="num">24</div>
              <div className="label">Reservas</div>
            </div>
            <div className="stat">
              <div className="num">8</div>
              <div className="label">Favoritos</div>
            </div>
            <div className="stat">
              <div className="num">3</div>
              <div className="label">Recomendaciones</div>
            </div>
          </div>
        </div>

        {loading && <div className="loading">Cargando datos...</div>}
        {error && (
          <div className="error" role="alert">
            Error: {error}
          </div>
        )}
      </section>
    </div>
  </div>
);

}

Profile.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  lastname: PropTypes.string,
};

Profile.defaultProps = {
  name: '',
  email: '',
  lastname: '',
};
