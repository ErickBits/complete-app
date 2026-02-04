import '../../style-sheets/home.css';

export default function HowItWorks() {
  return (
    <section className="how-it-works container" aria-labelledby="how-title">
      <h2 id="how-title" className="section-title">Cómo funciona</h2>
      <ol className="steps">
        <li><strong>Registro</strong> — El cliente crea una cuenta y completa su perfil.</li>
        <li><strong>Buscar disponibilidad</strong> — Selecciona fecha, hora y tamaño de mesa.</li>
        <li><strong>Reservar</strong> — Reserva confirmada por email; administrador puede aprobar.</li>
        <li><strong>Administración</strong> — El admin gestiona reservas, usuarios y reportes.</li>
      </ol>
    </section>
  );
}
