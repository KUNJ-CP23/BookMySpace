import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function StarRating({ rating }) {
  const n = Number(rating) || 0;
  return (
    <span className="flex items-center gap-0.5" title={`${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`h-4 w-4 ${s <= n ? "text-amber-400" : "text-gray-300 dark:text-zinc-600"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-gray-500 dark:text-zinc-400 font-medium">{n}</span>
    </span>
  );
}

function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [facilityFilter, setFacilityFilter] = useState("All");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const [revRes, facRes] = await Promise.all([
        API.get("/Reviews"),
        API.get("/Facilities"),
      ]);
      setReviews(revRes.data);
      setFacilities(facRes.data);
    } catch (err) {
      console.log("Reviews fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const deleteReview = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this review?")) return;
    try {
      await API.delete(`/Reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.log("Delete error:", err.response?.data || err);
      alert("Delete failed.");
    }
  };

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = reviews.filter((rv) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      rv.user?.fullName?.toLowerCase().includes(q) ||
      rv.facility?.name?.toLowerCase().includes(q) ||
      rv.comment?.toLowerCase().includes(q);
    const matchRating =
      ratingFilter === "All" || String(rv.rating) === ratingFilter;
    const matchFacility =
      facilityFilter === "All" || String(rv.facilityId) === facilityFilter;
    return matchSearch && matchRating && matchFacility;
  });

  const inputCls =
    "px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-zinc-100 p-6 lg:p-8">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Reviews
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
            Manage facility reviews and ratings
          </p>
        </div>
        {role === "Admin" && (
          <button
            onClick={() => navigate("/reviews/form")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all duration-150 cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Review
          </button>
        )}
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, facility or comment…"
            className={`w-full pl-9 pr-4 ${inputCls}`}
          />
        </div>
        {/* Rating filter */}
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className={`sm:w-40 ${inputCls} cursor-pointer`}
        >
          <option value="All">All Ratings</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={String(r)}>{"⭐".repeat(r)} {r}</option>
          ))}
        </select>
        {/* Facility filter */}
        <select
          value={facilityFilter}
          onChange={(e) => setFacilityFilter(e.target.value)}
          className={`sm:w-48 ${inputCls} cursor-pointer`}
        >
          <option value="All">All Facilities</option>
          {facilities.map((f) => (
            <option key={f.facilityId} value={String(f.facilityId)}>{f.name}</option>
          ))}
        </select>
      </div>

      {/* ── Table Card ──────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 dark:text-zinc-500">
            <svg className="animate-spin h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading…
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-zinc-500">
            <svg className="h-10 w-10 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.97 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L11.049 2.927z" />
            </svg>
            <p className="text-sm font-medium">No reviews found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/60">
                  {["User", "Facility", "Rating", "Comment", "Date", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 ${h === "Actions" ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-sm text-gray-400 dark:text-zinc-500">
                      No reviews match your search.
                    </td>
                  </tr>
                ) : filtered.map((rv) => (
                  <tr
                    key={rv.reviewId}
                    onClick={() => navigate(`/reviews/${rv.reviewId}`)}
                    className="hover:bg-blue-50/40 dark:hover:bg-zinc-800/50 transition-colors duration-100 cursor-pointer"
                  >
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {rv.user?.fullName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-zinc-100">
                          {rv.user?.fullName || "—"}
                        </span>
                      </div>
                    </td>
                    {/* Facility */}
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">
                      {rv.facility?.name || "—"}
                    </td>
                    {/* Rating */}
                    <td className="px-5 py-4">
                      <StarRating rating={rv.rating} />
                    </td>
                    {/* Comment preview */}
                    <td className="px-5 py-4 text-gray-500 dark:text-zinc-400 max-w-[220px]">
                      <span className="line-clamp-1">
                        {rv.comment || <span className="italic text-gray-400 dark:text-zinc-600">No comment</span>}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-5 py-4 text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                      {fmt(rv.createdAt)}
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {/* View */}
                        <button
                          onClick={() => navigate(`/reviews/${rv.reviewId}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 hover:shadow-sm hover:scale-105 active:scale-95 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 text-xs font-medium transition-all duration-150 cursor-pointer"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        {/* Edit */}
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/reviews/form/${rv.reviewId}`); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 hover:shadow-sm hover:scale-105 active:scale-95 text-amber-700 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 dark:text-amber-400 text-xs font-medium transition-all duration-150 cursor-pointer"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        {/* Delete */}
                        <button
                          onClick={(e) => deleteReview(rv.reviewId, e)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 hover:shadow-sm hover:scale-105 active:scale-95 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 text-xs font-medium transition-all duration-150 cursor-pointer"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Footer count */}
        {!loading && reviews.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/40 text-xs text-gray-500 dark:text-zinc-500">
            {filtered.length} of {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}