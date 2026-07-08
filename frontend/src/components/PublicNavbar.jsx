import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="public-navbar" id="public-navbar">
      <div className="public-navbar__container">
        <Link to="/" className="public-navbar__brand">
          <i className="fa-solid fa-mosque public-navbar__icon" style={{ fontSize: '24px', marginRight: '8px' }}></i>
          <span className="public-navbar__brand-text">SIMM Baitul Muttaqin</span>
        </Link>

        <button 
          className="public-navbar__toggle" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        <nav className={`public-navbar__nav ${isOpen ? 'open' : ''}`} aria-label="Navigasi utama">
          {navLinks.map((link) => {
            const isActive = link.to === "/" 
              ? location.pathname === "/"
              : location.pathname.startsWith(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`public-navbar__link ${
                  isActive ? "public-navbar__link--active" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          
          <Link to="/masuk" className="public-navbar__login-btn public-navbar__login-btn--mobile" onClick={() => setIsOpen(false)}>
            Masuk
          </Link>
        </nav>

        <Link to="/masuk" className="public-navbar__login-btn public-navbar__login-btn--desktop">
          Masuk
        </Link>
      </div>
    </header>
  );
}
