import { useEffect, useState } from "react";
import API from "../services/api";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [stats, setStats] = useState({
    users: 0,
    bookings: 0,
    facilities: 0,
    payments: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [users, bookings, facilities, payments] = await Promise.all([
        API.get("/Users").catch(() => null),
        API.get("/Bookings").catch(() => null),
        API.get("/Facilities").catch(() => null),
        API.get("/Payments").catch(() => null)
      ]);

      setStats({
        users: users?.data?.length || 0,
        bookings: bookings?.data?.length || 0,
        facilities: facilities?.data?.length || 0,
        payments: payments?.data?.length || 0
      });

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Welcome, {user?.fullName}
      </h2>

      {/* ADMIN DASHBOARD */}
      {role === "Admin" && (
        <div className="grid grid-cols-4 gap-4">
          <Card title="Total Users" value={stats.users} />
          <Card title="Total Bookings" value={stats.bookings} />
          <Card title="Facilities" value={stats.facilities} />
          <Card title="Payments" value={stats.payments} />
        </div>
      )}

      {/* OWNER DASHBOARD */}
      {role === "Owner" && (
        <div className="grid grid-cols-2 gap-4">
          <Card title="My Facilities" value={stats.facilities} />
          <Card title="Bookings" value={stats.bookings} />
        </div>
      )}

      {/* CUSTOMER DASHBOARD */}
      {role === "Customer" && (
        <div className="grid grid-cols-2 gap-4">
          <Card title="My Bookings" value={stats.bookings} />
          <Card title="Available Facilities" value={stats.facilities} />
        </div>
      )}
    </div>
  );
}

// 🔥 Reusable Card
function Card({ title, value }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-sm text-zinc-400">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}