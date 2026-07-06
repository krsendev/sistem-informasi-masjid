import { useState, useEffect } from "react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import api from "../api/axios";
import "./PublicPages.css";

const MONTHS_ID = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDateParts(dateStr) {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: MONTHS_ID[d.getMonth() + 1],
  };
}

export default function PublicKajian() {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("upcoming");

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, category: "kajian" };
      if (tab === "upcoming") params.upcoming = "true";
      if (search) params.search = search;

      const res = await api.get("/public/events", { params });
      setEvents(res.data?.data || []);
      setPagination(res.data?.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, search, tab]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <div className="public-page">
      <PublicNavbar />

      <section className="page-hero">
        <div className="page-hero__inner">
          <div className="page-hero__content">
            <div className="page-hero__badge">📖 Majelis Ilmu</div>
            <h1 className="page-hero__title">Jadwal Kajian &amp; Majelis Ilmu</h1>
            <p className="page-hero__subtitle">
              Perdalam pemahaman Anda tentang ilmu-ilmu Islam melalui sesi
              akademik terstruktur kami. Telusuri kajian mendatang, majelis ilmu
              rutin, dan seminar khusus.
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
              placeholder="Cari kajian..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="page-toolbar__search-btn" type="submit">🔍</button>
          </form>
          <div className="page-toolbar__filters">
            <button
              className={`page-toolbar__filter-btn ${tab === "upcoming" ? "page-toolbar__filter-btn--active" : ""}`}
              onClick={() => { setTab("upcoming"); setPage(1); }}
            >
              Mendatang
            </button>
            <button
              className={`page-toolbar__filter-btn ${tab === "all" ? "page-toolbar__filter-btn--active" : ""}`}
              onClick={() => { setTab("all"); setPage(1); }}
            >
              Semua Kajian
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state"><div className="loading-spinner" /></div>
        ) : events.length > 0 ? (
          <>
            <div className="event-list">
              {events.map((event) => {
                const dp = getDateParts(event.date);
                return (
                  <div className="event-card" key={event._id}>
                    <div className="event-card__date-block">
                      <div className="event-card__date-day">{dp.day}</div>
                      <div className="event-card__date-month">{dp.month}</div>
                    </div>
                    <div className="event-card__body">
                      <div className="event-card__time">
                        {event.startTime} - {event.endTime} WIB
                        <span className="event-card__category">{event.category}</span>
                      </div>
                      <h3 className="event-card__title">{event.title}</h3>
                      <div className="event-card__meta">
                        {event.ustadz && (
                          <span>🎤 {event.ustadz}</span>
                        )}
                        <span className="event-card__location">📍 {event.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
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
            <div className="empty-state__icon">📖</div>
            <p className="empty-state__text">
              {tab === "upcoming"
                ? "Belum ada kajian mendatang."
                : "Belum ada data kajian."}
            </p>
          </div>
        )}
      </div>

      <PublicFooter />
    </div>
  );
}
