import { Link, useLocation, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const location = useLocation();

  // 🔐 Get role
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  console.log("USER:", user);
console.log("ROLE:", role);

  // 🎯 Role-based navigation
  const nav = [
    { name: "Dashboard", path: "/" },

    // Admin only
    ...(role === "Admin"
      ? [
          { name: "Users", path: "/users" },
          { name: "Roles", path: "/roles" },
          { name: "Payment", path: "/payment" }
        ]
      : []),

    // Owner + Admin
    ...(role === "Owner" || role === "Admin" || role === "Customer"
      ? [{ name: "Facilities", path: "/facilities" }]
      : []),

    // Customer + Admin
    ...(role === "Customer" || role === "Admin"
      ? [{ name: "Bookings", path: "/bookings" }]
      : []),

    // Common
    { name: "Reviews", path: "/reviews" },
    { name: "Documents", path: "/documents" },
    { name: "FacilityImages", path: "/facility-images" }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top Navbar */}
      <div className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-wide">
            BookMySpace{" "}
            <span className="text-zinc-400 font-normal">
              {role}
            </span>
          </h1>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="text-sm text-red-400 hover:text-red-500"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="px-3 py-2 text-xs uppercase tracking-widest text-zinc-500">
              Navigation
            </p>

            <div className="space-y-1">
              {nav.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block rounded-xl px-3 py-2 text-sm transition ${
                      active
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Page Content */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            {/* 🔥 THIS IS IMPORTANT */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

