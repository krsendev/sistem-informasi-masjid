import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "240px",
        background: "#1e293b",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2>SIM Masjid</h2>

      <hr />

      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/users">Pengguna</Link>
        <Link to="/events">Event</Link>
        <Link to="/announcement">Pengumuman</Link>
        <Link to="/donations">Donasi</Link>
        <Link to="/finance">Keuangan</Link>
      </div>
    </div>
  );
}