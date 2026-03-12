import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const statusStyles = {
    Confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Cancelled: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

function StatusBadge({ status }) {
    const cls = statusStyles[status] ?? "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400";
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
            {status || "—"}
        </span>
    );
}

function fmt(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtTime(t) {
    if (!t) return "—";
    return t.substring(0, 5);
}

export default function BookingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await API.get("/Bookings");
                const found = res.data.find((b) => String(b.bookingId) === String(id));
                if (!found) {
                    alert("Booking not found.");
                    navigate("/bookings");
                    return;
                }
                setBooking(found);
            } catch (err) {
                console.log("Detail load error:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const cancelBooking = async () => {
        if (!window.confirm("Cancel this booking?")) return;
        try {
            await API.put(`/Bookings/${id}`, {
                ...booking,
                bookingStatus: "Cancelled",
                userId: booking.userId,
                facilityId: booking.facilityId,
                startTime: booking.startTime,
                endTime: booking.endTime,
            });
            navigate("/bookings");
        } catch (err) {
            console.log("Cancel error:", err.response?.data || err);
            alert("Cancel failed.");
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
                    Loading booking…
                </div>
            </div>
        );
    }

    if (!booking) return null;

    const b = booking;
    const infoRows = [
        { label: "User", value: b.user?.fullName },
        { label: "Facility", value: b.facility?.name },
        { label: "City", value: b.facility?.city },
        { label: "Address", value: b.facility?.address },
        { label: "Start Date", value: fmt(b.startDate) },
        { label: "End Date", value: fmt(b.endDate) },
        { label: "Time Slot", value: `${fmtTime(b.startTime)} – ${fmtTime(b.endTime)}` },
        { label: "Total Price", value: `₹${Number(b.totalPrice).toLocaleString("en-IN")}` },
        { label: "Payment Mode", value: b.paymentMode },
        { label: "Payment Status", value: b.paymentStatus },
        { label: "Created At", value: b.createdAt ? new Date(b.createdAt).toLocaleString("en-IN") : "—" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-zinc-100 p-6 lg:p-8">

            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate("/bookings")}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Bookings
                </button>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate(`/bookings/form/${id}`)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 hover:shadow-sm text-amber-700 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 dark:text-amber-400 text-sm font-medium transition-all duration-150 cursor-pointer"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Booking
                    </button>
                    {b.bookingStatus !== "Cancelled" && (
                        <button
                            onClick={cancelBooking}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 hover:shadow-sm text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 text-sm font-medium transition-all duration-150 cursor-pointer"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel Booking
                        </button>
                    )}
                </div>
            </div>

            {/* ── Detail Card ─────────────────────────────────────────── */}
            <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">

                {/* Card header */}
                <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            {b.facility?.name || "Booking Detail"}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
                            Booked by <span className="font-medium text-gray-700 dark:text-zinc-200">{b.user?.fullName || "—"}</span>
                        </p>
                    </div>
                    <StatusBadge status={b.bookingStatus} />
                </div>

                {/* Info grid */}
                <div className="grid sm:grid-cols-2 gap-px bg-gray-100 dark:bg-zinc-800">
                    {infoRows.map(({ label, value }) => (
                        <div key={label} className="bg-white dark:bg-zinc-900 px-6 py-4">
                            <p className="text-xs text-gray-400 dark:text-zinc-500 mb-0.5">{label}</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-zinc-100">{value || "—"}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
