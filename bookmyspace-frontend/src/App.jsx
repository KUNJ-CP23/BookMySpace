import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";

import Home from "./pages/Home";
import Users from "./pages/Users";
import Facilities from "./pages/Facilities";
import Bookings from "./pages/Bookings";
import Payment from "./pages/Payment";
import Roles from "./pages/Roles";
import Reviews from "./pages/Reviews";
import Documents from "./pages/Documents";
import FacilityImages from "./pages/FacilityImages";
import Login from "./pages/Login";

function RoleRoute(allowedRoles, element) {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // ⛔ If role not ready, don't redirect immediately
  if (!role) return null;

  return allowedRoles.includes(role)
    ? element
    : <Navigate to="/" />;
}


export default function App() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <Login />}
        />

        {/* Layout Route */}
        <Route
          path="/"
          element={token ? <DashboardLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Home />} />

          <Route path="users" element={RoleRoute(["Admin"], <Users />)} />
          <Route path="roles" element={RoleRoute(["Admin"], <Roles />)} />
          <Route path="payment" element={RoleRoute(["Admin"], <Payment />)} />

          <Route
            path="facilities"
            element={RoleRoute(["Admin", "Owner", "Customer"], <Facilities />)}
          />

          <Route
            path="bookings"
            element={RoleRoute(["Admin", "Customer"], <Bookings />)}
          />

          <Route path="reviews" element={<Reviews />} />
          <Route path="documents" element={<Documents />} />
          <Route path="facility-images" element={<FacilityImages />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}