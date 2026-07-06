import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import api from "../api/axios";
import heroImage from "../assets/hero-mosque.png";
import "./Beranda.css";

// Static prayer times (no prayer API in backend)
const PRAYER_TIMES = [
  { key: "fajr", label: "Subuh", time: "04:32" },
  { key: "sunrise", label: "Syuruq", time: "05:48" },
  { key: "dhuhr", label: "Dzuhur", time: "11:54" },
  { key: "asr", label: "Ashar", time: "15:12" },
  { key: "maghrib", label: "Maghrib", time: "18:01" },
  { key: "isha", label: "Isya", time: "19:15" },
];

function getActivePrayer() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let i = PRAYER_TIMES.length - 1; i >= 0; i--) {
    const [h, m] = PRAYER_TIMES[i].time.split(":").map(Number);
    if (currentMinutes >= h * 60 + m) {
      return PRAYER_TIMES[i].key;
    }
  }
  return PRAYER_TIMES[PRAYER_TIMES.length - 1].key;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getHijriDate() {
  try {
    const formatter = new Intl.DateTimeFormat("id-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formatter.format(new Date());
  } catch {
    return "";
  }
}

export default function Beranda() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [financeSummary, setFinanceSummary] = useState(null);
  const [activePrayer] = useState(getActivePrayer);
  const [hijriDate] = useState(getHijriDate);

  useEffect(() => {
    // Fetch public data — fail silently if backend is not running
    api
      .get("/public/announcements")
      .then((res) => setAnnouncements(res.data?.data || []))
      .catch(() => {});

    api
      .get("/public/events")
      .then((res) => setEvents(res.data?.data || []))
      .catch(() => {});

    api
      .get("/public/finance-summary")
      .then((res) => setFinanceSummary(res.data?.data || null))
      .catch(() => {});
  }, []);

  const latestAnnouncement = announcements[0] || null;

  return (
    <div className="beranda-page">
      <PublicNavbar />

      {/* === HERO === */}
      <section className="beranda-hero" id="beranda-hero">
        <div className="beranda-hero__inner">
          <div className="beranda-hero__content">
            <div className="beranda-hero__badge">✦ Enlightened Progress</div>
            <h1 className="beranda-hero__title">
              Memajukan Umat Melalui Ilmu &amp; Keimanan
            </h1>
            <p className="beranda-hero__subtitle">
              Selamat datang di portal resmi SIMM Al-Hikmah. Temukan program
              akademik, jadwal kajian mendatang, dan transparansi keuangan
              institusi untuk membangun komunitas yang modern dan terhubung.
            </p>
            <div className="beranda-hero__actions">
              <a href="#beranda-schedule" className="beranda-hero__btn-primary">
                Lihat Jadwal →
              </a>
              <Link to="/donasi" className="beranda-hero__btn-secondary">
                Salurkan Donasi
              </Link>
            </div>
          </div>
          <div className="beranda-hero__image">
            <img src={heroImage} alt="Ilustrasi Masjid Al-Hikmah" />
          </div>
        </div>
      </section>

      {/* === JADWAL SHOLAT === */}
      <section className="beranda-schedule" id="beranda-schedule">
        <div className="beranda-section">
          <div className="beranda-schedule__header">
            <h2 className="beranda-schedule__title">Jadwal Sholat Hari Ini</h2>
            <span className="beranda-schedule__date">{hijriDate}</span>
          </div>
          <div className="beranda-schedule__grid">
            {PRAYER_TIMES.map((prayer) => (
              <div
                key={prayer.key}
                className={`beranda-schedule__card ${
                  activePrayer === prayer.key
                    ? "beranda-schedule__card--active"
                    : ""
                }`}
              >
                <div className="beranda-schedule__card-label">
                  {prayer.label}
                </div>
                {activePrayer === prayer.key && (
                  <div className="beranda-schedule__card-indicator">
                    SEDANG BERLANGSUNG
                  </div>
                )}
                <div className="beranda-schedule__card-time">{prayer.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === PENGUMUMAN + KAJIAN === */}
      <section className="beranda-content">
        <div className="beranda-content__inner">
          <div className="beranda-content__grid">
            {/* Pengumuman Terbaru */}
            <div className="beranda-announcements">
              <div className="beranda-announcements__header">
                <h2 className="beranda-announcements__title">
                  Pengumuman Terbaru
                </h2>
                <Link
                  to="/pengumuman"
                  className="beranda-announcements__view-all"
                >
                  Lihat Semua →
                </Link>
              </div>

              {latestAnnouncement ? (
                <div className="beranda-announcement-card">
                  {latestAnnouncement.thumbnail ? (
                    <img
                      className="beranda-announcement-card__image"
                      src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${latestAnnouncement.thumbnail}`}
                      alt={latestAnnouncement.title}
                    />
                  ) : (
                    <div
                      className="beranda-announcement-card__image"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "32px",
                        color: "#005bac",
                      }}
                    >
                      📢
                    </div>
                  )}
                  <div className="beranda-announcement-card__body">
                    <div className="beranda-announcement-card__meta">
                      Diterbitkan:{" "}
                      {formatDate(
                        latestAnnouncement.publishedAt ||
                          latestAnnouncement.createdAt
                      )}
                    </div>
                    <h3 className="beranda-announcement-card__heading">
                      {latestAnnouncement.title}
                    </h3>
                    <p className="beranda-announcement-card__excerpt">
                      {latestAnnouncement.content?.replace(/<[^>]*>/g, "").slice(0, 180)}
                      ...
                    </p>
                    <Link
                      to="/pengumuman"
                      className="beranda-announcement-card__link"
                    >
                      Baca Selengkapnya
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="beranda-empty">
                  <div className="beranda-empty__icon">📋</div>
                  <p>Belum ada pengumuman terbaru.</p>
                </div>
              )}
            </div>

            {/* Kajian / Events Mendatang */}
            <div className="beranda-events">
              <div className="beranda-events__header">
                <svg
                  className="beranda-events__icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z" />
                </svg>
                <h2 className="beranda-events__title">Kajian Mendatang</h2>
              </div>

              <div className="beranda-events__list">
                {events.length > 0 ? (
                  events.map((event) => (
                    <div key={event._id} className="beranda-event-item">
                      <div className="beranda-event-item__content">
                        <span className="beranda-event-item__badge">
                          {formatDate(event.date)}, {event.startTime}
                        </span>
                        <h4 className="beranda-event-item__heading">
                          {event.title}
                        </h4>
                        {event.ustadz && (
                          <span className="beranda-event-item__meta">
                            {event.ustadz}
                          </span>
                        )}
                      </div>
                      <span className="beranda-event-item__arrow">›</span>
                    </div>
                  ))
                ) : (
                  <div className="beranda-empty">
                    <div className="beranda-empty__icon">📅</div>
                    <p>Belum ada kajian mendatang.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === TRANSPARANSI KEUANGAN === */}
      <section className="beranda-finance" id="beranda-finance">
        <div className="beranda-section">
          <div className="beranda-finance__card">
            <div className="beranda-finance__info">
              <h2 className="beranda-finance__title">
                Transparansi
                <br />
                Institusional
              </h2>
              <p className="beranda-finance__subtitle">
                Kami percaya pada kejelasan finansial sepenuhnya. Pantau
                perkembangan dana infrastruktur kami saat ini.
              </p>
              <Link to="/transparansi" className="beranda-finance__link">
                Lihat Laporan Detail 📊
              </Link>
            </div>

            <div className="beranda-finance__widget">
              <div className="beranda-finance__widget-header">
                <span className="beranda-finance__widget-label">
                  Total Pemasukan {financeSummary?.year || new Date().getFullYear()}
                </span>
              </div>
              <div className="beranda-finance__widget-amount">
                {financeSummary
                  ? formatCurrency(financeSummary.totalIncome)
                  : "Rp 0"}
              </div>
              <div className="beranda-finance__progress-track">
                <div
                  className="beranda-finance__progress-bar"
                  style={{
                    width: financeSummary
                      ? `${Math.min(
                          100,
                          Math.round(
                            (financeSummary.totalIncome /
                              Math.max(
                                financeSummary.totalIncome + financeSummary.totalExpense,
                                1
                              )) *
                              100
                          )
                        )}%`
                      : "0%",
                  }}
                />
              </div>
              <div className="beranda-finance__progress-footer">
                <span className="beranda-finance__progress-percent">
                  Pengeluaran:{" "}
                  {financeSummary
                    ? formatCurrency(financeSummary.totalExpense)
                    : "Rp 0"}
                </span>
                <span className="beranda-finance__progress-verified">
                  ✓ Data Terverifikasi
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
