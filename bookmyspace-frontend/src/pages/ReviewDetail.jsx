import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function StarRating({ rating }) {
  const n = Number(rating) || 0;
  return (
    <span className="flex items-center gap-1" title={`${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`h-5 w-5 ${s <= n ? "text-amber-400" : "text-gray-300 dark:text-zinc-600"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
      <span className="ml-1.5 text-sm text-gray-500 dark:text-zinc-400 font-medium">
        {n} / 5
      </span>
    </span>
  );
}

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await API.get("/Reviews");
        const found = res.data.find((r) => String(r.reviewId) === String(id));
        if (!found) {
          alert("Review not found.");
          navigate("/reviews");
          return;
        }
        setReview(found);
      } catch (err) {
        console.log("Detail load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const deleteReview = async () => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await API.delete(`/Reviews/${id}`);
      navigate("/reviews");
    } catch (err) {
      console.log("Delete error:", err.response?.data || err);
      alert("Delete failed.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="flex items-center gap-2 text-gray-400 dark:text-zinc-500 text-sm">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading review…
        </div>
      </div>
    );
  }

  if (!review) return null;

  const rv = review;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-zinc-100 p-6 lg:p-8">

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/reviews")}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Reviews
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/reviews/form/${id}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 hover:shadow-sm text-amber-700 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 dark:text-amber-400 text-sm font-medium transition-all duration-150 cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={deleteReview}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 hover:shadow-sm text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 text-sm font-medium transition-all duration-150 cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* ── Detail Card ──────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">

        {/* Card header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {rv.facility?.name || "Review Detail"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
              Reviewed by{" "}
              <span className="font-medium text-gray-700 dark:text-zinc-200">
                {rv.user?.fullName || "—"}
              </span>
            </p>
          </div>
          <StarRating rating={rv.rating} />
        </div>

        {/* Info grid */}
        <div className="grid sm:grid-cols-2 gap-px bg-gray-100 dark:bg-zinc-800">
          {[
            { label: "User", value: rv.user?.fullName },
            { label: "Facility", value: rv.facility?.name },
            { label: "Rating", value: `${rv.rating} out of 5` },
            {
              label: "Date Created",
              value: rv.createdAt
                ? new Date(rv.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—",
            },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-zinc-900 px-6 py-4">
              <p className="text-xs text-gray-400 dark:text-zinc-500 mb-0.5">{label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-zinc-100">{value || "—"}</p>
            </div>
          ))}
        </div>

        {/* Comment section (full width) */}
        <div className="bg-white dark:bg-zinc-900 px-6 py-5 border-t border-gray-100 dark:border-zinc-800">
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-2">Comment</p>
          {rv.comment ? (
            <p className="text-sm text-gray-800 dark:text-zinc-100 leading-relaxed whitespace-pre-wrap">
              {rv.comment}
            </p>
          ) : (
            <p className="text-sm italic text-gray-400 dark:text-zinc-600">No comment provided.</p>
          )}
        </div>
      </div>
    </div>
  );
}
