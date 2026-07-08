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



        <p className="public-footer__copyright">
          &copy; {currentYear} Sistem Informasi Manajemen Masjid. Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  );
}
