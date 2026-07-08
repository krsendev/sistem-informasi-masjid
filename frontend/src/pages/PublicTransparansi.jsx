import { useState, useEffect } from "react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import api from "../api/axios";
import "./PublicPages.css";

const MONTHS_ID = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PublicTransparansi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/public/finance-summary");
        setData(res.data?.data || null);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const maxMonthly = data
    ? Math.max(...data.months.map((m) => Math.max(m.income, m.expense)), 1)
    : 1;

  const maxCategory = data?.categoryBreakdown?.length
    ? Math.max(...data.categoryBreakdown.map((c) => c.total), 1)
    : 1;

  return (
    <div className="public-page">
      <PublicNavbar />

      <section className="page-hero">
        <div className="page-hero__inner">
          <div className="page-hero__content">
            <h1 className="page-hero__title">Transparansi Keuangan</h1>
            <p className="page-hero__subtitle">
              Akses terbuka terhadap catatan keuangan institusi. Dashboard ini
              memberikan gambaran jelas tentang pendapatan bulanan, pengeluaran,
              dan kemajuan pendanaan proyek.
            </p>
          </div>
        </div>
      </section>

      <div className="page-content">
        {loading ? (
          <div className="loading-state"><div className="loading-spinner" /></div>
        ) : data ? (
          <>
            {/* Summary Stats */}
            <div className="finance-stats">
              <div className="finance-stat-card">
                <div className="finance-stat-card__label"><i className="fa-solid fa-sack-dollar"></i> Total Pemasukan (YTD)</div>
                <div className="finance-stat-card__value">{formatCurrency(data.totalIncome)}</div>
                <div className="finance-stat-card__sub finance-stat-card__sub--positive">
                  {data.incomeCount} transaksi
                </div>
              </div>
              <div className="finance-stat-card">
                <div className="finance-stat-card__label"><i className="fa-solid fa-money-bill-transfer"></i> Total Pengeluaran (YTD)</div>
                <div className="finance-stat-card__value">{formatCurrency(data.totalExpense)}</div>
                <div className="finance-stat-card__sub">
                  {data.expenseCount} transaksi
                </div>
              </div>
              <div className="finance-stat-card">
                <div className="finance-stat-card__label"><i className="fa-solid fa-scale-balanced"></i> Saldo Bersih</div>
                <div className="finance-stat-card__value">{formatCurrency(data.balance)}</div>
                <div className="finance-stat-card__sub finance-stat-card__sub--positive">
                  Tahun {data.year}
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="finance-grid">
              {/* Monthly Bar Chart */}
              <div className="finance-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 className="finance-card__title" style={{ margin: 0 }}>Ringkasan Bulanan</h3>
                  <div className="chart-legend">
                    <span className="chart-legend-item">
                      <span className="chart-legend-dot chart-legend-dot--income" /> Pemasukan
                    </span>
                    <span className="chart-legend-item">
                      <span className="chart-legend-dot chart-legend-dot--expense" /> Pengeluaran
                    </span>
                  </div>
                </div>
                <div className="chart-bars">
                  {data.months.map((m) => (
                    <div className="chart-bar-group" key={m.month}>
                      <div className="chart-bar-pair">
                        <div
                          className="chart-bar chart-bar--income"
                          style={{ height: `${(m.income / maxMonthly) * 160}px` }}
                          title={`Pemasukan: ${formatCurrency(m.income)}`}
                        />
                        <div
                          className="chart-bar chart-bar--expense"
                          style={{ height: `${(m.expense / maxMonthly) * 160}px` }}
                          title={`Pengeluaran: ${formatCurrency(m.expense)}`}
                        />
                      </div>
                      <span className="chart-bar-label">{MONTHS_ID[m.month]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="finance-card">
                <h3 className="finance-card__title">Rincian Pengeluaran</h3>
                {data.categoryBreakdown?.length > 0 ? (
                  <div className="category-list">
                    {data.categoryBreakdown.map((cat) => (
                      <div className="category-item" key={cat._id}>
                        <span className="category-item__name">{cat._id}</span>
                        <div className="category-item__bar">
                          <div
                            className="category-item__bar-fill"
                            style={{ width: `${(cat.total / maxCategory) * 100}%` }}
                          />
                        </div>
                        <span className="category-item__value">{formatCurrency(cat.total)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#64748b", fontSize: 14 }}>Belum ada data pengeluaran.</p>
                )}
              </div>
            </div>

            {/* Recent Donations */}
            <div className="finance-grid">
              <div className="finance-card">
                <h3 className="finance-card__title">Donasi Terbaru</h3>
                {data.recentDonations?.length > 0 ? (
                  <table className="donation-table">
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>Donatur</th>
                        <th>Tujuan</th>
                        <th style={{ textAlign: "right" }}>Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentDonations.map((d) => (
                        <tr key={d._id}>
                          <td>{formatDate(d.date)}</td>
                          <td>{d.donorName || "Hamba Allah"}</td>
                          <td style={{ textTransform: "capitalize" }}>{d.category}</td>
                          <td style={{ textAlign: "right" }}>{formatCurrency(d.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: "#64748b", fontSize: 14 }}>Belum ada data donasi.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon"><i className="fa-solid fa-chart-line"></i></div>
            <p className="empty-state__text">Data keuangan belum tersedia.</p>
          </div>
        )}
      </div>

      <PublicFooter />
    </div>
  );
}
