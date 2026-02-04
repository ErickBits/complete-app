import '../../style-sheets/home.css';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} icash Reservations</span>
        <nav className="footer-nav" aria-label="Footer">
          <a href="/privacy">Privacidad</a>
          <a href="/terms">Términos</a>
        </nav>
      </div>
    </footer>
  );
}
