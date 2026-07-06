import MainLayout from "../layouts/MainLayout";

export default function Dashboard() {
  return (
    <MainLayout>
      <h1>Dashboard</h1>
    </MainLayout>
  );
}

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 20,
    marginTop: 30,
  }}
>
  <div style={cardStyle}>
    <h3>120</h3>
    <p>Jamaah</p>
  </div>

  <div style={cardStyle}>
    <h3>15</h3>
    <p>Event</p>
  </div>

  <div style={cardStyle}>
    <h3>Rp15.000.000</h3>
    <p>Donasi</p>
  </div>

  <div style={cardStyle}>
    <h3>Rp8.000.000</h3>
    <p>Keuangan</p>
  </div>
</div>

const cardStyle = {
  background: "white",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 0 5px rgba(0,0,0,.1)",
};