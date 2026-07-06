import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/masuk");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div
      style={{
        height: 60,
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <h3>Sistem Informasi Masjid</h3>

      <div>
        <span style={{ marginRight: 20 }}>
          {user?.nama || user?.name || "Admin"}
        </span>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}