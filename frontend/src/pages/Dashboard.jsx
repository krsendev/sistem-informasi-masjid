import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import MainLayout from "../layouts/MainLayout";
import api from "../api/axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    events: 0,
    donations: 0,
    finances: 0,
    expenses: 0,
    financeChartData: [],
    eventChartData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, financesRes] = await Promise.all([
          api.get("/events"),
          api.get("/finances"),
        ]);

        const allFinances = financesRes.data?.data || [];
        const totalPemasukan = allFinances
          .filter((item) => item.type === "income")
          .reduce((acc, item) => acc + Number(item.amount), 0);
        const totalPengeluaran = allFinances
          .filter((item) => item.type === "expense")
          .reduce((acc, item) => acc + Number(item.amount), 0);
        const saldo = totalPemasukan - totalPengeluaran;

        // Process Finance Chart Data (Monthly)
        const monthlyData = {};
        allFinances.forEach(item => {
          const date = new Date(item.date);
          const monthYear = date.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { name: monthYear, Pemasukan: 0, Pengeluaran: 0, timestamp: date.getTime() };
          }
          if (item.type === 'income') {
            monthlyData[monthYear].Pemasukan += Number(item.amount);
          } else if (item.type === 'expense') {
            monthlyData[monthYear].Pengeluaran += Number(item.amount);
          }
        });
        const financeChartData = Object.values(monthlyData).sort((a, b) => a.timestamp - b.timestamp);

        // Process Event Chart Data (by Category)
        const allEvents = eventsRes.data?.data || [];
        const eventCategoryData = {};
        allEvents.forEach(item => {
          const category = item.category || 'lainnya';
          const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
          if (!eventCategoryData[capitalizedCategory]) {
            eventCategoryData[capitalizedCategory] = { name: capitalizedCategory, Total: 0 };
          }
          eventCategoryData[capitalizedCategory].Total += 1;
        });
        const eventChartData = Object.values(eventCategoryData).sort((a, b) => b.Total - a.Total);

        setStats({
          events: allEvents.length || eventsRes.data?.data?.total || 0,
          donations: totalPemasukan,
          finances: saldo,
          expenses: totalPengeluaran,
          financeChartData,
          eventChartData,
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
          <>
            <div className="dashboard-stats-grid">
              <div className="stat-card income">
                <div className="stat-icon-wrapper">
                  <i className="fa-solid fa-hand-holding-dollar" style={{ fontSize: '24px' }}></i>
                </div>
                <div className="stat-content">
                  <span className="stat-value">{formatCurrency(stats.donations)}</span>
                  <span className="stat-label">Total Pemasukan</span>
                </div>
              </div>

              <div className="stat-card users">
                <div className="stat-icon-wrapper" style={{ background: '#fef2f2', color: '#ef4444' }}>
                  <i className="fa-solid fa-money-bill-transfer" style={{ fontSize: '24px' }}></i>
                </div>
                <div className="stat-content">
                  <span className="stat-value">{formatCurrency(stats.expenses)}</span>
                  <span className="stat-label">Total Pengeluaran</span>
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

              <div className="stat-card events">
                <div className="stat-icon-wrapper">
                  <i className="fa-regular fa-calendar-days" style={{ fontSize: '24px' }}></i>
                </div>
                <div className="stat-content">
                  <span className="stat-value">{stats.events}</span>
                  <span className="stat-label">Total Event / Kajian</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 100%', minWidth: 0, maxWidth: '100%', background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h2 className="dashboard-section-title" style={{ marginBottom: '20px' }}>Grafik Keuangan (Bulanan)</h2>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.financeChartData}
                      margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(value) => `Rp ${value / 1000000}M`}
                        style={{ fontSize: '12px' }}
                        width={65}
                      />
                      <Tooltip 
                        formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)}
                        cursor={{fill: 'transparent'}}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                      <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ flex: '1 1 100%', minWidth: 0, maxWidth: '100%', background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h2 className="dashboard-section-title" style={{ marginBottom: '20px' }}>Statistik Event (Kategori)</h2>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.eventChartData}
                      layout="vertical"
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} style={{ fontSize: '12px' }} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="Total" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}