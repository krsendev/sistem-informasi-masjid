import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/users", label: "Pengguna", icon: "👥" },
    { path: "/events", label: "Event", icon: "📅" },
    { path: "/announcement", label: "Pengumuman", icon: "📢" },
    { path: "/finance", label: "Keuangan", icon: "💰" },
  ];

  return (
    <div
      style={{
        width: "250px",
        background: "#1e293b",
        color: "white",
        minHeight: "100vh",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ padding: "0 10px", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#f8fafc" }}>SIM Masjid</h2>
      </div>

      <hr style={{ borderColor: "#334155", marginBottom: "20px", width: "100%" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: "none",
                color: isActive ? "#ffffff" : "#94a3b8",
                backgroundColor: isActive ? "#3b82f6" : "transparent",
                padding: "12px 16px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontWeight: isActive ? "600" : "500",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#334155";
                  e.currentTarget.style.color = "#f8fafc";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#94a3b8";
                }
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}