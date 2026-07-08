import { Link, useLocation } from "react-router-dom";
import "./PublicNavbar.css";

const navLinks = [
  { to: "/", label: "Beranda" },
  { to: "/pengumuman", label: "Pengumuman" },
  { to: "/kegiatan", label: "Kegiatan" },
  { to: "/transparansi", label: "Transparansi" },
];

export default function PublicNavbar() {
  const location = useLocation();

  return (
    <header className="public-navbar" id="public-navbar">
      <div className="public-navbar__container">
        <Link to="/" className="public-navbar__brand">
          <i className="fa-solid fa-mosque public-navbar__icon" style={{ fontSize: '24px', marginRight: '8px' }}></i>
          <span className="public-navbar__brand-text">SIMM Al-Hikmah</span>
        </Link>

        <nav className="public-navbar__nav" aria-label="Navigasi utama">
          {navLinks.map((link) => {
            const isActive = link.to === "/" 
              ? location.pathname === "/"
              : location.pathname.startsWith(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`public-navbar__link ${
                  isActive ? "public-navbar__link--active" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link to="/masuk" className="public-navbar__login-btn">
          Masuk
        </Link>
      </div>
    </header>
  );
}
