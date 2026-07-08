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
          donations: pubFinanceRes.data?.data?.totalIncomeAllTime || 0,
          finances: pubFinanceRes.data?.data?.balanceAllTime || 0,
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
                <i className="fa-solid fa-users" style={{ fontSize: '24px' }}></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.users}</span>
                <span className="stat-label">Total Jamaah</span>
              </div>
            </div>

            <div className="stat-card events">
              <div className="stat-icon-wrapper">
                <i className="fa-regular fa-calendar-days" style={{ fontSize: '24px' }}></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.events}</span>
                <span className="stat-label">Total Event / Kajian</span>
              </div>
            </div>

            <div className="stat-card income">
              <div className="stat-icon-wrapper">
                <i className="fa-solid fa-hand-holding-dollar" style={{ fontSize: '24px' }}></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatCurrency(stats.donations)}</span>
                <span className="stat-label">Total Pemasukan</span>
              </div>
            </div>

            <div className="stat-card balance">
              <div className="stat-icon-wrapper">
                <i className="fa-solid fa-wallet" style={{ fontSize: '24px' }}></i>
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