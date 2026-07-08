import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <i className="fa-solid fa-chart-pie"></i> },
    { path: "/users", label: "Pengguna", icon: <i className="fa-solid fa-users"></i> },
    { path: "/events", label: "Event", icon: <i className="fa-regular fa-calendar-days"></i> },
    { path: "/announcement", label: "Pengumuman", icon: <i className="fa-solid fa-bullhorn"></i> },
    { path: "/finance", label: "Keuangan", icon: <i className="fa-solid fa-wallet"></i> },
  ];

  return (
    <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div style={{ padding: "24px 16px 0 16px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#f8fafc" }}>SIM Masjid</h2>
        <button 
          className="hamburger-btn" 
          onClick={toggleSidebar}
          style={{ padding: 0, color: "#f8fafc" }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <hr style={{ borderColor: "#334155", marginBottom: "20px", width: "calc(100% - 32px)", margin: "0 auto 20px auto" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "0 16px 24px 16px" }}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth <= 768) {
                  toggleSidebar();
                }
              }}
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
              <span style={{ fontSize: "1.2rem", width: "24px", textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}