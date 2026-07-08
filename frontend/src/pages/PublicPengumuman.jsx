import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import api from "../api/axios";
import "./PublicPages.css";

const CATEGORIES = [
  "semua",
  "pengumuman",
  "ramadhan",
  "infaq",
  "zakat",
  "qurban",
  "lainnya",
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PublicPengumuman() {
  const [announcements, setAnnouncements] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("semua");
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (category !== "semua") params.category = category;

      const res = await api.get("/public/announcements", { params });
      setAnnouncements(res.data?.data || []);
      setPagination(res.data?.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch {
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, search, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const apiBase = import.meta.env.VITE_API_URL?.replace("/api", "") || "";

  return (
    <div className="public-page">
      <PublicNavbar />

      <section className="page-hero">
        <div className="page-hero__inner">
          <div className="page-hero__content">
            <div className="page-hero__badge"><i className="fa-solid fa-bullhorn"></i> Informasi Terkini</div>
            <h1 className="page-hero__title">Pengumuman</h1>
            <p className="page-hero__subtitle">
              Temukan informasi terbaru seputar kegiatan, program, dan
              pengumuman penting dari Masjid Baitul Muttaqin.
            </p>
          </div>
        </div>
      </section>

      <div className="page-content">
        <div className="page-toolbar">
          <form className="page-toolbar__search" onSubmit={handleSearch}>
            <input
              className="page-toolbar__search-input"
              type="text"
              placeholder="Cari pengumuman..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="page-toolbar__search-btn" type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
          </form>
          <div className="page-toolbar__filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`page-toolbar__filter-btn ${category === cat ? "page-toolbar__filter-btn--active" : ""}`}
                onClick={() => { setCategory(cat); setPage(1); }}
              >
                {cat === "semua" ? "Semua" : cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-state"><div className="loading-spinner" /></div>
        ) : announcements.length > 0 ? (
          <>
            <div className="cards-grid">
              {announcements.map((item) => (
                <div className="card" key={item._id}>
                  {item.thumbnail ? (
                    <img className="card__image" src={`${apiBase}${item.thumbnail}`} alt={item.title} />
                  ) : (
                    <div className="card__image-placeholder"><i className="fa-regular fa-newspaper"></i></div>
                  )}
                  <div className="card__body">
                    <span className="card__category">{item.category}</span>
                    <h3 className="card__title">{item.title}</h3>
                    <div className="card__meta">
                      <span className="card__meta-item"><i className="fa-regular fa-calendar"></i> {formatDate(item.publishedAt || item.createdAt)}</span>
                      {item.author?.name && (
                        <span className="card__meta-item"><i className="fa-solid fa-pencil"></i> {item.author.name}</span>
                      )}
                    </div>
                    <p className="card__excerpt">
                      {item.content?.replace(/<[^>]*>/g, "").slice(0, 150)}...
                    </p>
                  </div>
                  <div className="card__footer">
                    <Link to={`/pengumuman/${item._id}`} className="card__link">
                      Baca Selengkapnya →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination__btn"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  ← Sebelumnya
                </button>
                <span className="pagination__info">
                  Halaman {pagination.page} dari {pagination.totalPages}
                </span>
                <button
                  className="pagination__btn"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Selanjutnya →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon"><i className="fa-solid fa-clipboard-list"></i></div>
            <p className="empty-state__text">Belum ada pengumuman yang diterbitkan.</p>
          </div>
        )}
      </div>

      <PublicFooter />
    </div>
  );
}
