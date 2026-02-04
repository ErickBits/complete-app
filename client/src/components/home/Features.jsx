import '../../style-sheets/home.css';

const items = [
  { img: 'https://img.icons8.com/ios-filled/64/000000/user-male-circle.png', title: 'Autenticación segura', text: 'Registro, login con JWT, recuperación de contraseña y roles.' },
  { img: 'https://img.icons8.com/ios-filled/64/000000/calendar.png', title: 'Reservas y disponibilidad', text: 'Calendario interactivo, bloqueo de franjas y gestión de mesas.' },
  { img: 'https://img.icons8.com/ios-filled/64/000000/redis.png', title: 'Cache y rendimiento', text: 'Redis para sesiones y cache de disponibilidad.' },
  { img: 'https://img.icons8.com/ios-filled/64/000000/cloud.png', title: 'Despliegue en la nube', text: 'EKS, RDS y S3 para despliegue escalable y seguro.' },
];

export default function Features() {
  return (
    <section className="features container" aria-labelledby="features-title">
      <h2 id="features-title" className="section-title">Características principales</h2>
      <div className="feature-grid">
        {items.map((f) => (
          <article key={f.title} className="feature">
            <img src={f.img} alt="" aria-hidden="true" />
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
