import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../api/axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    donations: 0,
    finances: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, eventsRes, pubFinanceRes] = await Promise.all([
          api.get("/users"),
          api.get("/events"),
          api.get("/public/finance-summary"),
        ]);

        setStats({
          users: usersRes.data?.data?.length || usersRes.data?.data?.total || 0,
          events: eventsRes.data?.data?.length || eventsRes.data?.data?.total || 0,
          donations: pubFinanceRes.data?.data?.totalIncome || 0,
          finances: pubFinanceRes.data?.data?.balance || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <MainLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard Admin</h1>
            <p className="dashboard-subtitle">
              Selamat datang kembali! Berikut adalah ringkasan data masjid.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <div className="spinner"></div>
            <p>Memuat data statistik...</p>
          </div>
        ) : (
          <div className="dashboard-stats-grid">
            <div className="stat-card users">
              <div className="stat-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.users}</span>
                <span className="stat-label">Total Jamaah</span>
              </div>
            </div>

            <div className="stat-card events">
              <div className="stat-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.events}</span>
                <span className="stat-label">Total Event / Kajian</span>
              </div>
            </div>

            <div className="stat-card income">
              <div className="stat-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatCurrency(stats.donations)}</span>
                <span className="stat-label">Total Pemasukan</span>
              </div>
            </div>

            <div className="stat-card balance">
              <div className="stat-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatCurrency(stats.finances)}</span>
                <span className="stat-label">Saldo Keuangan</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}