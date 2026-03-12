import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All"); // All / Government / Private
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await API.get("/Facilities");
        // Fetch first image for each facility in parallel
        const withImages = await Promise.all(
          res.data.map(async (f) => {
            try {
              const imgRes = await API.get(`/Facilities/${f.facilityId}/images`);
              return { ...f, _firstImage: imgRes.data?.[0]?.imageUrl || null };
            } catch {
              return { ...f, _firstImage: null };
            }
          })
        );
        setFacilities(withImages);
      } catch (err) {
        console.log("Facilities error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Derived filter options ─────────────────────────────────────────────────
  const cities = useMemo(
    () => ["All", ...new Set(facilities.map((f) => f.city).filter(Boolean))],
    [facilities]
  );
  const categories = useMemo(
    () => ["All", ...new Set(facilities.map((f) => f.category).filter(Boolean))],
    [facilities]
  );

  // ── Filtering ────────────────────────────────────────────────────────────
  const filtered = facilities.filter((f) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      f.name?.toLowerCase().includes(q) ||
      f.city?.toLowerCase().includes(q) ||
      f.category?.toLowerCase().includes(q);
    const matchCity = cityFilter === "All" || f.city === cityFilter;
    const matchCategory = categoryFilter === "All" || f.category === categoryFilter;
    const matchType =
      typeFilter === "All" ||
      (typeFilter === "Government" && f.isGovOwned) ||
      (typeFilter === "Private" && !f.isGovOwned);
    return matchSearch && matchCity && matchCategory && matchType;
  });

  const inputCls =
    "px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-zinc-100 p-6 lg:p-8">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Facilities</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">Browse and manage all facilities</p>
        </div>
        {(role === "Admin" || role === "Owner") && (
          <button
            onClick={() => navigate("/facilities/form")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all duration-150 cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Facility
          </button>
        )}
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city or category…"
            className={`w-full pl-9 pr-4 ${inputCls}`}
          />
        </div>
        {/* City */}
        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className={`sm:w-40 ${inputCls} cursor-pointer`}>
          {cities.map((c) => <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>)}
        </select>
        {/* Category */}
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={`sm:w-44 ${inputCls} cursor-pointer`}>
          {categories.map((c) => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
        </select>
        {/* Type */}
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={`sm:w-44 ${inputCls} cursor-pointer`}>
          <option value="All">All Types</option>
          <option value="Government">Government</option>
          <option value="Private">Private</option>
        </select>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-32 text-gray-400 dark:text-zinc-500">
          <svg className="animate-spin h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-gray-400 dark:text-zinc-500">
          <svg className="h-12 w-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M9 21V7l6-4v18M9 11h6M9 15h6" />
          </svg>
          <p className="text-sm font-medium">No facilities found</p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((f) => (
              <div
                key={f.facilityId}
                onClick={() => navigate(`/facilities/${f.facilityId}`)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                {/* Image */}
                <div className="relative h-44 bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                  {f._firstImage ? (
                    <img
                      src={`http://localhost:5203/${f._firstImage}`}
                      alt={f.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-300 dark:text-zinc-600">
                      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Gov badge */}
                  {f.isGovOwned && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-white shadow">
                      Government
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-zinc-100 leading-snug line-clamp-1">{f.name}</h3>
                    <span className="shrink-0 text-sm font-bold text-blue-600 dark:text-blue-400">
                      ₹{Number(f.pricePerHour).toLocaleString("en-IN")}<span className="text-xs font-normal text-gray-400 dark:text-zinc-500">/hr</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 mb-2">
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {f.city || "—"}
                  </div>

                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 mb-3">
                    {f.category || "—"}
                  </span>

                  {f.description && (
                    <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {f.description}
                    </p>
                  )}

                  {f.user?.fullName && (
                    <p className="mt-2 text-xs text-gray-400 dark:text-zinc-500">
                      Owner: <span className="text-gray-600 dark:text-zinc-300 font-medium">{f.user.fullName}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs text-gray-400 dark:text-zinc-500">
            {filtered.length} of {facilities.length} facilit{facilities.length !== 1 ? "ies" : "y"}
          </p>
        </>
      )}
    </div>
  );
}