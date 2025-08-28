import '../style-sheets/header.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header id="header">
            <div className="logo-control">
                <img id="header-img" src="https://user-images.githubusercontent.com/100820534/164579594-2ccab160-439a-46ca-a4db-98c38f46f841.png" alt="Logo da icash?"/> <p class="logo-word">icash</p>
            </div>
            <nav id="nav-bar">
                <ul className="nav-bar-control">
                    <li className="nav-link up-grd">
                        <Link className="up-grd" to="/upgrade">Upgrade</Link>
                    </li>
                    <li className="nav-link">
                        <Link className="link" to="/register">Log-in</Link>
                    </li>
                    <li className="nav-link">
                        <Link className="link" to="/signup">Sign-in</Link>
                    </li>
                </ul>
            </nav>

        </header>
    );
}

export default Header;