import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// ─── Icons ────────────────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// ─── Nav item icon map ────────────────────────────────────────────────────────
const navIcons = {
  Dashboard: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Users: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Roles: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Payment: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  Facilities: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M9 21V7l6-4v18M9 11h6M9 15h6" />
    </svg>
  ),
  Bookings: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Reviews: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Documents: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  FacilityImages: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardLayout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [iconKey, setIconKey] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const handleToggle = () => {
    setIconKey((k) => k + 1);
    toggleTheme();
  };

  const nav = [
    { name: "Dashboard", path: "/" },
    ...(role === "Admin"
      ? [
        { name: "Users", path: "/users" },
        // { name: "Roles", path: "/roles" },  // hidden – re-enable when needed
        { name: "Payment", path: "/payments" },
      ]
      : []),
    ...(role === "Owner" || role === "Admin" || role === "Customer"
      ? [{ name: "Facilities", path: "/facilities" }]
      : []),
    ...(role === "Customer" || role === "Admin"
      ? [{ name: "Bookings", path: "/bookings" }]
      : []),
    { name: "Reviews", path: "/reviews" },
    // { name: "Documents", path: "/documents" },  // now embedded in Facility detail page
    // { name: "FacilityImages", path: "/facility-images" },  // hidden – managed within Facilities module
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-zinc-950 text-gray-800 dark:text-zinc-100">

      {/* ── Fixed Sidebar ─────────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">

        {/* Logo area */}
        <div className="flex items-center gap-3 px-5 h-[61px] border-b border-gray-200 dark:border-zinc-800">
          <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500 text-white font-bold text-sm shrink-0">
            B
          </div>
          <span className="font-semibold text-gray-900 dark:text-white tracking-tight">
            BookMySpace
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {nav.map((item) => {
            const active = location.pathname === item.path;
            const icon = navIcons[item.name];
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active
                  ? "bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-white"
                  : "text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/60 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                <span
                  className={`shrink-0 ${active
                    ? "text-blue-600 dark:text-white"
                    : "text-gray-400 dark:text-zinc-500 group-hover:text-gray-600"
                    }`}
                >
                  {icon}
                </span>
                {item.name}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user info */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.fullName?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 dark:text-zinc-100 truncate leading-tight">
                {user?.fullName}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 leading-tight">{role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Right Column (Navbar + Content) ───────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top Navbar */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-[61px] border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur shrink-0">

          {/* Mobile: logo (hidden on md+) */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500 text-white font-bold text-sm">
              B
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">BookMySpace</span>
          </div>

          {/* Desktop: page context placeholder - empty div for spacing */}
          <div className="hidden md:block" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={handleToggle}
              aria-label="Toggle theme"
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              <span key={iconKey} className="theme-icon-enter">
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </span>
            </button>

            {/* Divider */}
            <span className="h-5 w-px bg-gray-200 dark:bg-zinc-700 mx-1" />

            {/* Logout */}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
