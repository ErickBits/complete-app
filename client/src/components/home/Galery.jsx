import '../../style-sheets/home.css';

const images = [
  { src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcdef123456', caption: 'Interfaz de reservas' },
  { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=123456abcdef', caption: 'Panel administrador' },
  { src: 'https://images.unsplash.com/photo-1541542684-6e6f3b2f9f2b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=7890abcd1234', caption: 'Reservas desde móvil' },
];

export default function Gallery() {
  return (
    <section className="gallery container" aria-labelledby="gallery-title">
      <h2 id="gallery-title" className="section-title">Vista previa</h2>
      <div className="gallery-grid">
        {images.map((img) => (
          <figure key={img.caption}>
            <img src={img.src} alt={img.caption} />
            <figcaption>{img.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
