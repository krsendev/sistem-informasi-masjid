import { Link, useLocation } from "react-router-dom";
import "./PublicNavbar.css";

const navLinks = [
  { to: "/", label: "Beranda" },
  { to: "/pengumuman", label: "Pengumuman" },
  { to: "/kajian", label: "Kajian" },
  { to: "/kegiatan", label: "Kegiatan" },
  { to: "/transparansi", label: "Transparansi" },
];

export default function PublicNavbar() {
  const location = useLocation();

  return (
    <header className="public-navbar" id="public-navbar">
      <div className="public-navbar__container">
        <Link to="/" className="public-navbar__brand">
          <svg className="public-navbar__icon" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M12 2L2 8.5V10h1v10h2V10h14v10h2V10h1V8.5L12 2zm0 2.31L19 8H5l7-3.69zM8 18v-6h3v6H8zm5 0v-6h3v6h-3z"/>
          </svg>
          <span className="public-navbar__brand-text">SIMM Al-Hikmah</span>
        </Link>

        <nav className="public-navbar__nav" aria-label="Navigasi utama">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`public-navbar__link ${
                location.pathname === link.to ? "public-navbar__link--active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link to="/masuk" className="public-navbar__login-btn">
          Masuk
        </Link>
      </div>
    </header>
  );
}
