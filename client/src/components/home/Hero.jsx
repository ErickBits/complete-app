import '../../style-sheets/home.css';

export default function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-text">
        <h1 id="hero-title" className="title">Reserva fácil. Cena tranquila.</h1>
        <p className="subtitle">
          Sistema de reservas para restaurantes con roles, panel de administración,
          notificaciones y despliegue en la nube. Rápido de usar, fácil de administrar.
        </p>
        <div className="cta-row">
          <a className="btn primary" href="/signup">Crear cuenta</a>
          <a className="btn ghost" href="/login">Iniciar sesión</a>
        </div>
      </div>

      <div className="hero-image" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1541542684-6e6f3b2f9f2b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a2b3c4d5e6f"
          alt="Interior de restaurante moderno"
        />
      </div>
    </section>
  );
}
