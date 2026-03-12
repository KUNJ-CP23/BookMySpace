import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function ReviewForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const empty = { userId: "", facilityId: "", rating: "", comment: "" };
  const [form, setForm] = useState(empty);

  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, facRes, bookRes] = await Promise.all([
          API.get("/Users").catch(() => ({ data: [] })),
          API.get("/Facilities").catch(() => ({ data: [] })),
          API.get("/Bookings").catch(() => ({ data: [] })),
        ]);
        setUsers(userRes.data);
        setFacilities(facRes.data);
        setBookings(bookRes.data);

        if (isEdit) {
          const revRes = await API.get("/Reviews");
          const found = revRes.data.find((r) => String(r.reviewId) === String(id));
          if (found) {
            setForm({
              userId: String(found.userId),
              facilityId: String(found.facilityId),
              rating: String(found.rating),
              comment: found.comment || "",
            });
          } else {
            alert("Review not found.");
            navigate("/reviews");
          }
        }
      } catch (err) {
        console.log("Load error:", err.response?.data || err);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUserChange = (e) => {
    setForm((prev) => ({ ...prev, userId: e.target.value, facilityId: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        userId: parseInt(form.userId),
        facilityId: parseInt(form.facilityId),
        rating: parseInt(form.rating),
        comment: form.comment,
      };
      if (isEdit) {
        await API.put(`/Reviews/${id}`, payload);
      } else {
        await API.post("/Reviews", payload);
      }
      navigate("/reviews");
    } catch (err) {
      console.log("Submit error:", err.response?.data || err);
      alert(isEdit ? "Update failed. Please try again." : "Failed to create review.");
    } finally {
      setLoading(false);
    }
  };

  // Users who have at least one booking
  const bookedUserIds = [...new Set(bookings.map((b) => b.userId))];
  const usersWhoBooked = users.filter((u) => bookedUserIds.includes(u.userId));

  // Facilities booked by the selected user
  const userBookings = bookings.filter((b) => String(b.userId) === form.userId);
  const facilityIdsForUser = [...new Set(userBookings.map((b) => b.facilityId))];
  const filteredFacilities = facilities.filter((f) =>
    facilityIdsForUser.includes(f.facilityId)
  );

  if (fetching) {
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

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-[600px]">

        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => navigate("/reviews")}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {isEdit ? "Edit Review" : "Add Review"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
              {isEdit ? "Update the details for this review" : "Fill in the details to submit a new review"}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* User */}
            <div>
              <label className={labelCls}>
                User <span className="text-red-500">*</span>
              </label>
              <select
                name="userId"
                required
                value={form.userId}
                onChange={handleUserChange}
                className={inputCls}
              >
                <option value="">Select a user</option>
                {usersWhoBooked.map((u) => (
                  <option key={u.userId} value={u.userId}>{u.fullName}</option>
                ))}
              </select>
            </div>

            {/* Facility */}
            <div>
              <label className={labelCls}>
                Facility <span className="text-red-500">*</span>
              </label>
              <select
                name="facilityId"
                required
                value={form.facilityId}
                onChange={handleChange}
                disabled={!form.userId}
                className={`${inputCls} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">
                  {form.userId ? "Select a facility" : "Select a user first"}
                </option>
                {filteredFacilities.map((f) => (
                  <option key={f.facilityId} value={f.facilityId}>{f.name}</option>
                ))}
              </select>
              {form.userId && filteredFacilities.length === 0 && (
                <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                  This user has no bookings to review.
                </p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className={labelCls}>
                Rating <span className="text-red-500">*</span>
              </label>
              <select
                name="rating"
                required
                value={form.rating}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">Select a rating</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{"⭐".repeat(r)}  {r} star{r !== 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>

            {/* Comment */}
            <div>
              <label className={labelCls}>Comment</label>
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                rows={4}
                placeholder="Write a comment about this facility…"
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-zinc-800 pt-2" />

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold shadow-sm transition-all duration-150 cursor-pointer"
              >
                {loading
                  ? isEdit ? "Saving…" : "Creating…"
                  : isEdit ? "Update Review" : "Create Review"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/reviews")}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
