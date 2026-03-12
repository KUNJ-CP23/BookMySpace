import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";

import Home from "./pages/Home";
import Users from "./pages/Users";
import UserForm from "./pages/UserForm";
import Facilities from "./pages/Facilities";
import FacilityForm from "./pages/FacilityForm";
import FacilityDetail from "./pages/FacilityDetail";
import Bookings from "./pages/Bookings";
import BookingForm from "./pages/BookingForm";
import BookingDetail from "./pages/BookingDetail";
import Payment from "./pages/Payment";
import PaymentForm from "./pages/PaymentForm";
import Roles from "./pages/Roles";
import Reviews from "./pages/Reviews";
import ReviewForm from "./pages/ReviewForm";
import ReviewDetail from "./pages/ReviewDetail";
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
          <Route path="users/form" element={RoleRoute(["Admin"], <UserForm />)} />
          <Route path="users/form/:id" element={RoleRoute(["Admin"], <UserForm />)} />
          <Route path="roles" element={RoleRoute(["Admin"], <Roles />)} />
          <Route path="payment" element={RoleRoute(["Admin"], <Payment />)} />
          <Route path="payments" element={RoleRoute(["Admin"], <Payment />)} />
          <Route path="payments/form" element={RoleRoute(["Admin"], <PaymentForm />)} />
          <Route path="payments/form/:id" element={RoleRoute(["Admin"], <PaymentForm />)} />

          <Route
            path="facilities"
            element={RoleRoute(["Admin", "Owner", "Customer"], <Facilities />)}
          />
          <Route
            path="facilities/form"
            element={RoleRoute(["Admin", "Owner"], <FacilityForm />)}
          />
          <Route
            path="facilities/form/:id"
            element={RoleRoute(["Admin", "Owner"], <FacilityForm />)}
          />
          <Route
            path="facilities/:id"
            element={RoleRoute(["Admin", "Owner", "Customer"], <FacilityDetail />)}
          />

          <Route
            path="bookings"
            element={RoleRoute(["Admin", "Customer"], <Bookings />)}
          />
          <Route
            path="bookings/form"
            element={RoleRoute(["Admin"], <BookingForm />)}
          />
          <Route
            path="bookings/form/:id"
            element={RoleRoute(["Admin"], <BookingForm />)}
          />
          <Route
            path="bookings/:id"
            element={RoleRoute(["Admin", "Customer"], <BookingDetail />)}
          />

          <Route path="reviews" element={<Reviews />} />
          <Route path="reviews/form" element={<ReviewForm />} />
          <Route path="reviews/form/:id" element={<ReviewForm />} />
          <Route path="reviews/:id" element={<ReviewDetail />} />
          <Route path="documents" element={<Documents />} />
          <Route path="facility-images" element={<FacilityImages />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}