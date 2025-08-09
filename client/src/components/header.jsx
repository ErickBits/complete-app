import '../style-sheets/header.css';

function Header() {
    return (
        <header id="header">
            <div className="logo-control">
                <img id="header-img" src="https://user-images.githubusercontent.com/100820534/164579594-2ccab160-439a-46ca-a4db-98c38f46f841.png" alt="Logo da icash?"/> <p class="logo-word">icash</p>
            </div>
            <nav id="nav-bar">
            <ul className="nav-bar-control">
                <a className="up-grd" href="www.google.com"><li class="nav-link  up-grd">Upgrade</li></a>
                <a className="link" href="www.google.com"><li class="nav-link">Log-in</li></a>
                <a className="link" href="www.google.com"><li class="nav-link">Sign-in</li></a>
            </ul>
            </nav>
        </header>
    );
}

export default Header;