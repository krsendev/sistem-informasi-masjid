import { Link } from "react-router-dom";
import "./PublicFooter.css";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="public-footer" id="public-footer">
      <div className="public-footer__container">
        <div className="public-footer__brand">
          <span className="public-footer__brand-text">SIMM Baitul Muttaqin</span>
        </div>

        <nav className="public-footer__nav" aria-label="Footer navigation">
          <Link to="/kebijakan-privasi" className="public-footer__link">
            Kebijakan Privasi
          </Link>
          <Link to="/ketentuan-layanan" className="public-footer__link">
            Ketentuan Layanan
          </Link>
          <Link to="/transparansi" className="public-footer__link">
            Transparansi Keuangan
          </Link>
          <Link to="/hubungi-kami" className="public-footer__link">
            Hubungi Kami
          </Link>
        </nav>

        <p className="public-footer__copyright">
          &copy; {currentYear} Sistem Informasi Manajemen Masjid. Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  );
}
