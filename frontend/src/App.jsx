import { BrowserRouter, Routes, Route } from "react-router-dom";

import Beranda from "./pages/Beranda";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

import Users from "./pages/Users";
import Events from "./pages/Events";
import Announcement from "./pages/Announcement";
import Finance from "./pages/Finance";

// Public pages
import PublicPengumuman from "./pages/PublicPengumuman";
import PublicKegiatan from "./pages/PublicKegiatan";
import PublicTransparansi from "./pages/PublicTransparansi";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Beranda />} />
        <Route path="/masuk" element={<Login />} />
        <Route path="/pengumuman" element={<PublicPengumuman />} />
        <Route path="/pengumuman/:id" element={<PublicPengumuman />} />
        <Route path="/kegiatan" element={<PublicKegiatan />} />
        <Route path="/transparansi" element={<PublicTransparansi />} />

        {/* Protected Routes (Admin Dashboard) */}
        <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } 
        />
        <Route path="/events" element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route path="/announcement" element={
            <ProtectedRoute>
              <Announcement />
            </ProtectedRoute>
          }
        />
        <Route path="/finance" element={
            <ProtectedRoute>
              <Finance />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;