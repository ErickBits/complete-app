import '../../style-sheets/home.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="logo">
       <img src="https://img.icons8.com/ios-filled/50/000000/hexagon.png" alt="minimal logo" />

      </div>
      <nav>
        <ul className="nav">
          <li><Link to="/register">Log in</Link></li>
          <li><Link to="/signup">Sign up</Link></li>
        </ul>
      </nav>
    </header> 
  );
}

export default Header;
