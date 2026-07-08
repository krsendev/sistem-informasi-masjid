import { useState, useEffect } from "react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import api from "../api/axios";
import "./PublicPages.css";

const CATEGORIES = [
  "semua",
  "kajian",
  "sholat",
  "pengajian",
  "ramadhan",
  "musyawarah",
  "sosial",
  "pendidikan",
  "lainnya",
];

const MONTHS_ID = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function getDateParts(dateStr) {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: MONTHS_ID[d.getMonth() + 1],
  };
}

export default function PublicKegiatan() {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("semua");
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("upcoming");

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (tab === "upcoming") params.upcoming = "true";
      if (search) params.search = search;
      if (category !== "semua") params.category = category;

      const res = await api.get("/public/events", { params });
      setEvents(res.data?.data || []);
      setPagination(res.data?.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, search, category, tab]);

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
            <div className="page-hero__badge"><i className="fa-solid fa-mosque"></i> Program & Kegiatan</div>
            <h1 className="page-hero__title">Kegiatan Masjid</h1>
            <p className="page-hero__subtitle">
              Jadwal lengkap kegiatan masjid meliputi sholat berjamaah, pengajian,
              kegiatan sosial, musyawarah, dan program pendidikan lainnya.
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
              placeholder="Cari kegiatan..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="page-toolbar__search-btn" type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
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
              Semua
            </button>
          </div>
        </div>

        <div className="page-toolbar" style={{ marginTop: -12 }}>
          <div className="page-toolbar__filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`page-toolbar__filter-btn ${category === cat ? "page-toolbar__filter-btn--active" : ""}`}
                onClick={() => { setCategory(cat); setPage(1); }}
              >
                {cat === "semua" ? "Semua Kategori" : cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-state"><div className="loading-spinner" /></div>
        ) : events.length > 0 ? (
          <>
            <div className="event-list">
              {events.map((event) => {
                const dp = getDateParts(event.date);
                const isPast = new Date(event.date) < new Date();
                return (
                  <div className="event-card" key={event._id} style={isPast ? { opacity: 0.6 } : {}}>
                    <div className="event-card__date-block">
                      <div className="event-card__date-day">{dp.day}</div>
                      <div className="event-card__date-month">{dp.month}</div>
                    </div>
                    <div className="event-card__body">
                      <div className="event-card__time">
                        {event.startTime} - {event.endTime} WIB
                        <span className="event-card__category">{event.category}</span>
                        {isPast && (
                          <span style={{
                            fontSize: 11, fontWeight: 600, color: "#64748b",
                            background: "#f1f5f9", padding: "2px 8px", borderRadius: 3, marginLeft: 8
                          }}>
                            Selesai
                          </span>
                        )}
                      </div>
                      <h3 className="event-card__title">{event.title}</h3>
                      <div className="event-card__meta">
                        {event.ustadz && <span><i className="fa-solid fa-microphone"></i> {event.ustadz}</span>}
                        <span className="event-card__location"><i className="fa-solid fa-location-dot"></i> {event.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button className="pagination__btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  ← Sebelumnya
                </button>
                <span className="pagination__info">
                  Halaman {pagination.page} dari {pagination.totalPages}
                </span>
                <button className="pagination__btn" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>
                  Selanjutnya →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon"><i className="fa-regular fa-calendar-xmark"></i></div>
            <p className="empty-state__text">
              {tab === "upcoming" ? "Belum ada kegiatan mendatang." : "Belum ada data kegiatan."}
            </p>
          </div>
        )}
      </div>

      <PublicFooter />
    </div>
  );
}
