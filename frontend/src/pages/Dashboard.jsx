import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../api/axios";

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
          api.get("/public/finance-summary")
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

  const cardStyle = {
    background: "white",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 0 5px rgba(0,0,0,.1)",
  };

  return (
    <MainLayout>
      <h1>Dashboard</h1>
      
      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 20,
            marginTop: 30,
          }}
        >
          <div style={cardStyle}>
            <h3>{stats.users}</h3>
            <p>Jamaah</p>
          </div>

          <div style={cardStyle}>
            <h3>{stats.events}</h3>
            <p>Event</p>
          </div>

          <div style={cardStyle}>
            <h3>{formatCurrency(stats.donations)}</h3>
            <p>Total Pemasukan</p>
          </div>

          <div style={cardStyle}>
            <h3>{formatCurrency(stats.finances)}</h3>
            <p>Saldo Keuangan</p>
          </div>
        </div>
      )}
    </MainLayout>
  );
}