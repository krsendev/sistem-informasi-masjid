import { useNavigate } from "react-router-dom";

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/masuk");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div
      style={{
        height: "70px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button 
          className="hamburger-btn" 
          onClick={toggleSidebar}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <h3 style={{ margin: 0, color: "#334155", fontSize: "1.2rem", fontWeight: "600" }}>
          Admin Panel
        </h3>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#e0f2fe",
            color: "#0284c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "14px"
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <span style={{ fontWeight: "500", color: "#475569" }}>
            {user?.nama || user?.name || "Admin"}
          </span>
        </div>

        <button 
          onClick={logout}
          style={{
            background: "#fee2e2",
            color: "#ef4444",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
            fontSize: "14px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fecaca";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fee2e2";
          }}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          Keluar
        </button>
      </div>
    </div>
  );
}