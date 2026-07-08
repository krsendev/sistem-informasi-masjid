import { useNavigate } from "react-router-dom";

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/masuk");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="admin-navbar">
      <div className="admin-navbar__left">
        <button 
          className="hamburger-btn" 
          onClick={toggleSidebar}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <h3 className="admin-navbar__title">
          Admin Panel
        </h3>
      </div>

      <div className="admin-navbar__right">
        <div className="admin-navbar__user">
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
            fontSize: "14px",
            flexShrink: 0
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <span className="admin-navbar__user-name">
            {user?.nama || user?.name || "Admin"}
          </span>
        </div>

        <button 
          onClick={logout}
          className="admin-navbar__logout"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}