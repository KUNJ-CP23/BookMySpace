import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

// ─── Icons (inline SVG) ──────────────────────────────────────────────────────
function UsersIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m0 0a4 4 0 118 0m-8 0A4 4 0 019 12a4 4 0 014 4" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  );
}
function BuildingIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M9 21V7l6-4v18M9 11h6M9 15h6" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function CurrencyIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16" />
    </svg>
  );
}
function UsersSmIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}
function TrendUpIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
}
function TrendDownIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    </svg>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    Paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Unpaid: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] || "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
      {status}
    </span>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-zinc-700/50 bg-white dark:bg-zinc-800 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-700 rounded-full" />
        <div className="h-10 w-10 bg-gray-200 dark:bg-zinc-700 rounded-xl" />
      </div>
      <div className="h-8 w-16 bg-gray-200 dark:bg-zinc-700 rounded-lg mb-2" />
      <div className="h-3 w-20 bg-gray-100 dark:bg-zinc-700/50 rounded-full" />
    </div>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({ title, value, icon: Icon, iconBg, trend, trendUp, delay = 0 }) {
  return (
    <div
      className="group relative rounded-2xl border border-gray-100 dark:border-zinc-700/50 bg-white dark:bg-zinc-800 p-5 shadow-sm hover:shadow-lg dark:hover:shadow-zinc-900/50 hover:-translate-y-1 cursor-default"
      style={{
        animation: `fadeSlideUp 0.5s ease-out ${delay}ms both`,
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">{title}</p>
        <div className={`h-10 w-10 flex items-center justify-center rounded-xl ${iconBg}`}>
          <span className="text-white">
            <Icon />
          </span>
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
      <div className={`inline-flex items-center gap-1 text-xs font-medium ${trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
        {trendUp ? <TrendUpIcon /> : <TrendDownIcon />}
        {trend}
        <span className="text-gray-400 dark:text-zinc-500 font-normal ml-1">vs last month</span>
      </div>
    </div>
  );
}

// ─── Quick Action Button ──────────────────────────────────────────────────────
function QuickAction({ icon: Icon, label, onClick, colorClass }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full rounded-xl border px-4 py-3.5 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${colorClass}`}
    >
      <span className="flex-shrink-0"><Icon /></span>
      {label}
    </button>
  );
}

// ─── Owner Dashboard ──────────────────────────────────────────────────────────
function OwnerDashboard({ user, navigate }) {
  const userId = user?.userId;

  const [ownerFacilities, setOwnerFacilities] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadOwnerData(); }, []);

  const loadOwnerData = async () => {
    setLoading(true);
    try {
      const [facRes, bkRes] = await Promise.all([
        API.get("/Facilities").catch(() => null),
        API.get("/Bookings").catch(() => null),
      ]);

      // Filter only this owner's facilities
      const myFacilities = (facRes?.data || []).filter(
        (f) => f.userId === userId || String(f.userId) === String(userId)
      );
      setOwnerFacilities(myFacilities);

      // Facility IDs owned by this owner
      const myFacilityIds = new Set(myFacilities.map((f) => f.facilityId));

      // Filter bookings that belong to owner's facilities
      const myBookings = (bkRes?.data || []).filter((b) =>
        myFacilityIds.has(b.facilityId)
      );

      const sorted = [...myBookings]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);
      setOwnerBookings(sorted);

      // Sum earnings from confirmed/paid bookings
      const totalEarnings = myBookings.reduce(
        (sum, b) => sum + (Number(b.totalPrice) || 0),
        0
      );
      setEarnings(totalEarnings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const summaryCards = [
    { title: "My Facilities", value: ownerFacilities.length, icon: BuildingIcon, iconBg: "bg-violet-500", trend: "+3%", trendUp: true, delay: 0 },
    { title: "My Bookings", value: ownerBookings.length, icon: CalendarIcon, iconBg: "bg-emerald-500", trend: "+8%", trendUp: true, delay: 80 },
    { title: "My Earnings", value: `₹${earnings.toLocaleString("en-IN")}`, icon: CurrencyIcon, iconBg: "bg-amber-500", trend: "+5%", trendUp: true, delay: 160 },
  ];

  return (
    <div style={{ animation: "fadeSlideUp 0.4s ease-out both" }}>
      {/* Refresh */}
      <div className="flex justify-end mb-6">
        <button
          onClick={loadOwnerData}
          className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-1.5 text-sm text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer shadow-sm"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : summaryCards.map((c) => <SummaryCard key={c.title} {...c} />)}
      </div>

      {/* Facilities Grid + Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* My Facilities */}
        <div
          className="rounded-2xl border border-gray-100 dark:border-zinc-700/50 bg-white dark:bg-zinc-800 p-5 shadow-sm"
          style={{ animation: "fadeSlideUp 0.5s ease-out 280ms both" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200 uppercase tracking-widest">My Facilities</h3>
            <button
              onClick={() => navigate("/facilities")}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              View all →
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-zinc-700/50 animate-pulse" />
              ))}
            </div>
          ) : ownerFacilities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <BuildingIcon />
              <p className="mt-3 text-sm text-gray-400 dark:text-zinc-500">No facilities yet</p>
              <button
                onClick={() => navigate("/facilities")}
                className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Add your first facility →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ownerFacilities.slice(0, 4).map((f) => (
                <div
                  key={f.facilityId}
                  className="rounded-xl border border-gray-100 dark:border-zinc-700/50 bg-gray-50 dark:bg-zinc-900/60 p-3.5 hover:shadow-md hover:-translate-y-0.5"
                  style={{ transition: "box-shadow 0.2s ease, transform 0.2s ease" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">
                      <BuildingIcon />
                    </div>
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                      ₹{Number(f.pricePerHour || 0).toLocaleString("en-IN")}/hr
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-zinc-100 truncate">{f.name}</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-500 truncate">{f.city}{f.category ? ` · ${f.category}` : ""}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div
          className="rounded-2xl border border-gray-100 dark:border-zinc-700/50 bg-white dark:bg-zinc-800 p-5 shadow-sm"
          style={{ animation: "fadeSlideUp 0.5s ease-out 340ms both" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200 uppercase tracking-widest">Recent Bookings</h3>
            <button
              onClick={() => navigate("/bookings")}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              View all →
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-gray-100 dark:bg-zinc-700/50 animate-pulse" />
              ))}
            </div>
          ) : ownerBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CalendarIcon />
              <p className="mt-3 text-sm text-gray-400 dark:text-zinc-500">No bookings for your facilities yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-700/60">
                    <th className="pb-2.5 pl-1 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Customer</th>
                    <th className="pb-2.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Facility</th>
                    <th className="pb-2.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-700/40">
                  {ownerBookings.map((b) => (
                    <tr key={b.bookingId} className="hover:bg-gray-50 dark:hover:bg-zinc-700/30">
                      <td className="py-3 pl-1 font-medium text-gray-800 dark:text-zinc-200 max-w-[100px] truncate">
                        {b.user?.fullName || "—"}
                      </td>
                      <td className="py-3 text-gray-600 dark:text-zinc-400 max-w-[100px] truncate">
                        {b.facility?.name || "—"}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={b.bookingStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Customer Dashboard ──────────────────────────────────────────────────────
function CustomerDashboard({ user, navigate }) {
  const userId = user?.userId;

  const [allFacilities, setAllFacilities] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bkRes, facRes] = await Promise.all([
        API.get("/Bookings").catch(() => null),
        API.get("/Facilities").catch(() => null),
      ]);

      // Only this customer's bookings
      const mine = (bkRes?.data || []).filter(
        (b) => b.userId === userId || String(b.userId) === String(userId)
      );
      setMyBookings(
        [...mine].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      );

      setAllFacilities(facRes?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Upcoming = confirmed bookings with future startDate
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingBookings = myBookings.filter(
    (b) =>
      b.bookingStatus === "Confirmed" &&
      b.startDate &&
      new Date(b.startDate) >= today
  );

  const summaryCards = [
    {
      title: "My Bookings",
      value: myBookings.length,
      icon: CalendarIcon,
      iconBg: "bg-emerald-500",
      trend: "+3%",
      trendUp: true,
      delay: 0,
    },
    {
      title: "Upcoming",
      value: upcomingBookings.length,
      icon: ClockIcon,
      iconBg: "bg-blue-500",
      trend: upcomingBookings.length > 0 ? "Active" : "None",
      trendUp: upcomingBookings.length > 0,
      delay: 80,
    },
    {
      title: "Total Facilities",
      value: allFacilities.length,
      icon: BuildingIcon,
      iconBg: "bg-violet-500",
      trend: "+5%",
      trendUp: true,
      delay: 160,
    },
  ];

  return (
    <div style={{ animation: "fadeSlideUp 0.4s ease-out both" }}>
      {/* Refresh */}
      <div className="flex justify-end mb-6">
        <button
          onClick={loadData}
          className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-1.5 text-sm text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer shadow-sm"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Summary Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : summaryCards.map((c) => <SummaryCard key={c.title} {...c} />)}
      </div>

      {/* ── Quick Actions ──────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border border-gray-100 dark:border-zinc-700/50 bg-white dark:bg-zinc-800 p-5 shadow-sm mb-6"
        style={{ animation: "fadeSlideUp 0.5s ease-out 200ms both" }}
      >
        <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200 uppercase tracking-widest mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/facilities")}
            className="flex items-center gap-3 w-full rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20 px-4 py-4 text-sm font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 cursor-pointer"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500 text-white shrink-0">
              <BuildingIcon />
            </span>
            <div className="text-left">
              <p className="font-semibold">Browse Facilities</p>
              <p className="text-xs text-blue-500 dark:text-blue-500 font-normal mt-0.5">Explore and book available spaces</p>
            </div>
          </button>
          <button
            onClick={() => navigate("/bookings")}
            className="flex items-center gap-3 w-full rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-4 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 cursor-pointer"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white shrink-0">
              <CalendarIcon />
            </span>
            <div className="text-left">
              <p className="font-semibold">My Bookings</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 font-normal mt-0.5">View and manage your bookings</p>
            </div>
          </button>
        </div>
      </div>

      {/* ── My Recent Bookings ─────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border border-gray-100 dark:border-zinc-700/50 bg-white dark:bg-zinc-800 p-5 shadow-sm"
        style={{ animation: "fadeSlideUp 0.5s ease-out 300ms both" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200 uppercase tracking-widest">
            Recent Bookings
          </h3>
          <button
            onClick={() => navigate("/bookings")}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            View all →
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-gray-100 dark:bg-zinc-700/50 animate-pulse" />
            ))}
          </div>
        ) : myBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarIcon />
            <p className="mt-3 text-sm text-gray-400 dark:text-zinc-500">No bookings yet</p>
            <button
              onClick={() => navigate("/bookings")}
              className="mt-3 text-xs font-medium bg-blue-600 dark:bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 cursor-pointer"
            >
              Make your first booking →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-700/60">
                  <th className="pb-2.5 pl-1 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Facility</th>
                  <th className="pb-2.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="pb-2.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider hidden md:table-cell">Time Slot</th>
                  <th className="pb-2.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-700/40">
                {myBookings.slice(0, 3).map((b) => {
                  const timeSlot = b.startTime && b.endTime
                    ? `${b.startTime.substring(0, 5)} – ${b.endTime.substring(0, 5)}`
                    : "—";
                  return (
                    <tr
                      key={b.bookingId}
                      onClick={() => navigate(`/bookings/${b.bookingId}`)}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-700/30 cursor-pointer transition-colors"
                    >
                      <td className="py-3 pl-1 font-medium text-gray-800 dark:text-zinc-200 max-w-[120px] truncate">
                        {b.facility?.name || "—"}
                      </td>
                      <td className="py-3 text-gray-500 dark:text-zinc-500 hidden sm:table-cell whitespace-nowrap">
                        {b.startDate
                          ? new Date(b.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="py-3 text-gray-500 dark:text-zinc-500 hidden md:table-cell whitespace-nowrap">
                        {timeSlot}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={b.bookingStatus} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── Admin Charts ─────────────────────────────────────────────────────────────
function AdminCharts({ allBookings, allUsers, allPayments, theme }) {
  const isDark = theme === "dark";

  // Chart style tokens
  const axisColor = isDark ? "#71717a" : "#9ca3af";  // zinc-500 / gray-400
  const gridColor = isDark ? "#27272a" : "#f3f4f6";  // zinc-800 / gray-100
  const tooltipBg = isDark ? "#18181b" : "#ffffff";
  const tooltipBorder = isDark ? "#3f3f46" : "#e5e7eb";
  const tooltipText = isDark ? "#f4f4f5" : "#111827";

  // ── 1. Booking Trends: bookings grouped by month ──────────────────────────
  const bookingTrends = (() => {
    const map = {};
    allBookings.forEach((b) => {
      const d = b.createdAt || b.startDate;
      if (!d) return;
      const label = new Date(d).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
      map[label] = (map[label] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => new Date("1 " + a[0]) - new Date("1 " + b[0]))
      .map(([month, count]) => ({ month, Bookings: count }));
  })();

  // ── 2. Revenue: payments grouped by month ────────────────────────────────
  const revenueData = (() => {
    const map = {};
    allPayments.forEach((p) => {
      const d = p.paymentDate || p.createdAt;
      if (!d) return;
      const label = new Date(d).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
      map[label] = (map[label] || 0) + (Number(p.amount) || 0);
    });
    // fallback: derive from bookings if payments table is empty
    if (Object.keys(map).length === 0) {
      allBookings.forEach((b) => {
        const d = b.createdAt || b.startDate;
        if (!d) return;
        const label = new Date(d).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
        map[label] = (map[label] || 0) + (Number(b.totalPrice) || 0);
      });
    }
    return Object.entries(map)
      .sort((a, b) => new Date("1 " + a[0]) - new Date("1 " + b[0]))
      .map(([month, revenue]) => ({ month, Revenue: Math.round(revenue) }));
  })();

  // ── 3. Role distribution ─────────────────────────────────────────────────
  const roleData = (() => {
    const map = {};
    allUsers.forEach((u) => {
      const r = u.role || u.roleName || "Unknown";
      map[r] = (map[r] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

  const cardClass =
    "rounded-2xl border border-gray-100 dark:border-zinc-700/50 bg-white dark:bg-zinc-800 p-5 shadow-sm";

  const ChartCard = ({ title, children, style }) => (
    <div className={cardClass} style={style}>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200 uppercase tracking-widest mb-4">
        {title}
      </h3>
      {children}
    </div>
  );

  const customTooltipStyle = {
    backgroundColor: tooltipBg,
    border: `1px solid ${tooltipBorder}`,
    borderRadius: "12px",
    color: tooltipText,
    fontSize: "12px",
    padding: "8px 12px",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

      {/* Booking Trends */}
      <ChartCard
        title="Booking Trends"
        style={{ animation: "fadeSlideUp 0.5s ease-out 300ms both" }}
      >
        {bookingTrends.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-zinc-500 text-center py-10">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={bookingTrends} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={customTooltipStyle} cursor={{ stroke: isDark ? "#52525b" : "#d1d5db", strokeWidth: 1 }} />
              <Line
                type="monotone"
                dataKey="Bookings"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: "#3b82f6", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                isAnimationActive={true}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Revenue Bar Chart */}
      <ChartCard
        title="Revenue"
        style={{ animation: "fadeSlideUp 0.5s ease-out 380ms both" }}
      >
        {revenueData.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-zinc-500 text-center py-10">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={customTooltipStyle}
                cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
                formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
              />
              <Bar dataKey="Revenue" fill="#8b5cf6" radius={[6, 6, 0, 0]} isAnimationActive={true} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Role Distribution Pie */}
      <ChartCard
        title="Role Distribution"
        style={{ animation: "fadeSlideUp 0.5s ease-out 460ms both" }}
      >
        {roleData.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-zinc-500 text-center py-10">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
                isAnimationActive={true}
                animationDuration={800}
              >
                {roleData.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={customTooltipStyle} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: axisColor, fontSize: "11px" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const navigate = useNavigate();

  const [stats, setStats] = useState({ users: 0, bookings: 0, facilities: 0, payments: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    if (role === "Admin") loadStats();
  }, [role]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [users, bookings, facilities, payments] = await Promise.all([
        API.get("/Users").catch(() => null),
        API.get("/Bookings").catch(() => null),
        API.get("/Facilities").catch(() => null),
        API.get("/Payments").catch(() => null),
      ]);

      setStats({
        users: users?.data?.length || 0,
        bookings: bookings?.data?.length || 0,
        facilities: facilities?.data?.length || 0,
        payments: payments?.data?.length || 0,
      });

      // Store raw arrays for charts
      setAllBookings(bookings?.data || []);
      setAllUsers(users?.data || []);
      setAllPayments(payments?.data || []);

      if (bookings?.data) {
        const sorted = [...bookings.data]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentBookings(sorted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── OWNER ────────────────────────────────────────────────────────────────────
  if (role === "Owner") return <OwnerDashboard user={user} navigate={navigate} />;

  // ── CUSTOMER ─────────────────────────────────────────────────────────────────
  if (role === "Customer") return <CustomerDashboard user={user} navigate={navigate} />;

  // ── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
  if (role !== "Admin") return null;

  const summaryCards = [
    { title: "Total Users", value: stats.users, icon: UsersIcon, iconBg: "bg-blue-500", trend: "+12%", trendUp: true, delay: 0 },
    { title: "Total Facilities", value: stats.facilities, icon: BuildingIcon, iconBg: "bg-violet-500", trend: "+5%", trendUp: true, delay: 80 },
    { title: "Total Bookings", value: stats.bookings, icon: CalendarIcon, iconBg: "bg-emerald-500", trend: "+8%", trendUp: true, delay: 160 },
    { title: "Total Payments", value: stats.payments, icon: CurrencyIcon, iconBg: "bg-amber-500", trend: "-2%", trendUp: false, delay: 240 },
  ];

  return (
    <div style={{ animation: "fadeSlideUp 0.4s ease-out both" }}>

      {/* Refresh */}
      <div className="flex justify-end mb-6">
        <button
          onClick={loadStats}
          className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-1.5 text-sm text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer shadow-sm"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Summary Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : summaryCards.map((card) => <SummaryCard key={card.title} {...card} />)}
      </div>

      {/* ── Charts ─────────────────────────────────────────────────── */}
      {!loading && <AdminCharts allBookings={allBookings} allUsers={allUsers} allPayments={allPayments} theme={theme} />}

      {/* ── Quick Actions + Recent Activity ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div
            className="rounded-2xl border border-gray-100 dark:border-zinc-700/50 bg-white dark:bg-zinc-800 p-5 shadow-sm h-full"
            style={{ animation: "fadeSlideUp 0.5s ease-out 300ms both" }}
          >
            <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200 mb-4 uppercase tracking-widest">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <QuickAction
                icon={PlusIcon}
                label="Add Facility"
                onClick={() => navigate("/facilities")}
                colorClass="border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 hover:border-violet-300 dark:hover:border-violet-500/60"
              />
              <QuickAction
                icon={UsersSmIcon}
                label="Manage Users"
                onClick={() => navigate("/users")}
                colorClass="border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:border-blue-300 dark:hover:border-blue-500/60"
              />
              <QuickAction
                icon={BookIcon}
                label="View Bookings"
                onClick={() => navigate("/bookings")}
                colorClass="border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-500/60"
              />
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl border border-gray-100 dark:border-zinc-700/50 bg-white dark:bg-zinc-800 p-5 shadow-sm"
            style={{ animation: "fadeSlideUp 0.5s ease-out 350ms both" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200 uppercase tracking-widest">
                Recent Bookings
              </h3>
              <button
                onClick={() => navigate("/bookings")}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                View all →
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-xl bg-gray-100 dark:bg-zinc-700/50 animate-pulse" />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CalendarIcon />
                <p className="mt-3 text-sm text-gray-400 dark:text-zinc-500">No bookings yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-zinc-700/60">
                      <th className="pb-2.5 pl-1 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">User</th>
                      <th className="pb-2.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Facility</th>
                      <th className="pb-2.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                      <th className="pb-2.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-zinc-700/40">
                    {recentBookings.map((b) => (
                      <tr key={b.bookingId} className="hover:bg-gray-50 dark:hover:bg-zinc-700/30 rounded-xl">
                        <td className="py-3 pl-1 font-medium text-gray-800 dark:text-zinc-200 max-w-[120px] truncate">
                          {b.user?.fullName || "—"}
                        </td>
                        <td className="py-3 text-gray-600 dark:text-zinc-400 max-w-[120px] truncate">
                          {b.facility?.name || "—"}
                        </td>
                        <td className="py-3 text-gray-500 dark:text-zinc-500 hidden sm:table-cell whitespace-nowrap">
                          {b.startDate ? new Date(b.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={b.bookingStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}