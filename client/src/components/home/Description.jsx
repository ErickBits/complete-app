import '../../style-sheets/home.css';

export default function Description() {
  return (
    <section className="description container" aria-labelledby="desc-title">
      <h2 id="desc-title" className="section-title">Qué hace este proyecto</h2>
      <p>
        Permite a clientes crear cuentas, reservar mesas por franjas horarias,
        editar o cancelar reservas y gestionar su perfil. Los administradores pueden ver
        y gestionar todas las reservas, administrar usuarios y consultar estadísticas.
      </p>
    </section>
  );
}
