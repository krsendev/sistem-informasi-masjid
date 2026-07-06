import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

import Users from "./pages/Users";
import Events from "./pages/Events";
import Announcement from "./pages/Announcement";
import Donations from "./pages/Donations";
import Finance from "./pages/Finance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

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

        <Route path="/donations" element={
            <ProtectedRoute>
              <Donations />
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