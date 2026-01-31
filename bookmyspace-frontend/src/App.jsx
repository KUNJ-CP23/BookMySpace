import { BrowserRouter, Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/facility-images" element={<FacilityImages />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}