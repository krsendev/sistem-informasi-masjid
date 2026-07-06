import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Navbar />

        <div style={{ padding: 25 }}>{children}</div>
      </div>
    </div>
  );
}