import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function PaymentForm() {
    const { id } = useParams();         // present → Edit mode
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    const [form, setForm] = useState({
        bookingId: "",
        userId: "",
        userFullName: "",
        amount: "",
        paymentMethod: "",
        transactionId: "",
        remarks: "",
    });

    // ── Load bookings (always) + payment data (edit mode only) ────────────────
    useEffect(() => {
        const loadData = async () => {
            try {
                const bookingsRes = await API.get("/Bookings");
                const allBookings = bookingsRes.data.filter((b) => !b.facility?.isGovOwned);
                setBookings(allBookings);

                if (isEdit) {
                    const paymentsRes = await API.get("/Payments");
                    const payment = paymentsRes.data.find(
                        (p) => String(p.paymentId) === String(id)
                    );
                    if (payment) {
                        // find the matching booking to show user name
                        const matchedBooking = allBookings.find(
                            (b) => b.bookingId === payment.bookingId
                        );
                        setForm({
                            bookingId: String(payment.bookingId),
                            userId: String(payment.userId),
                            userFullName: payment.user?.fullName || matchedBooking?.user?.fullName || "",
                            amount: String(payment.amount),
                            paymentMethod: payment.paymentMethod || "",
                            transactionId: payment.transactionId || "",
                            remarks: payment.remarks || "",
                        });
                    } else {
                        alert("Payment not found.");
                        navigate("/payments");
                    }
                }
            } catch (err) {
                console.log("Load error:", err.response?.data || err);
            } finally {
                setFetching(false);
            }
        };

        loadData();
    }, [id]);

    // ── Auto-fill User + Amount when booking is chosen ────────────────────────
    const handleBookingChange = (e) => {
        const bookingId = e.target.value;
        const selected = bookings.find((b) => String(b.bookingId) === bookingId);
        setForm((prev) => ({
            ...prev,
            bookingId,
            userId: selected ? String(selected.userId) : "",
            userFullName: selected?.user?.fullName || "",
            amount: selected ? String(selected.totalPrice) : "",
        }));
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                bookingId: parseInt(form.bookingId),
                userId: parseInt(form.userId),
                amount: parseFloat(form.amount),
                paymentMethod: form.paymentMethod,
                transactionId: form.transactionId || "TXN" + Date.now(),
                remarks: form.remarks,
            };

            if (isEdit) {
                await API.put(`/Payments/${id}`, payload);
            } else {
                await API.post("/Payments", payload);
            }
            navigate("/payments");
        } catch (err) {
            console.log("Submit error:", err.response?.data || err);
            alert(isEdit ? "Update failed. Please try again." : "Payment creation failed. Please check the details.");
        } finally {
            setLoading(false);
        }
    };

    // ── Loading skeleton (edit mode fetching) ────────────────────────────────
    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
                <div className="flex items-center gap-2 text-gray-400 dark:text-zinc-500 text-sm">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Loading payment…
                </div>
            </div>
        );
    }

    const inputCls =
        "w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
    const readonlyCls =
        "w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800/60 text-gray-500 dark:text-zinc-400 cursor-not-allowed";

    // ── Form ──────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-start justify-center px-4 py-12">
            <div className="w-full max-w-[560px]">

                {/* Back + Title */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        type="button"
                        onClick={() => navigate("/payments")}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            {isEdit ? "Edit Payment" : "Add Payment"}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
                            {isEdit
                                ? "Update the details for this payment record"
                                : "Fill in the details to create a new payment record"}
                        </p>
                    </div>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Booking */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                                Booking <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="bookingId"
                                required
                                value={form.bookingId}
                                onChange={handleBookingChange}
                                className={inputCls}
                            >
                                <option value="">Select a booking</option>
                                {bookings.map((b) => (
                                    <option key={b.bookingId} value={String(b.bookingId)}>
                                        #{b.bookingId} — {b.user?.fullName} · {b.facility?.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* User (auto-filled, read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                                User
                                <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-zinc-500">(auto-filled from booking)</span>
                            </label>
                            <input
                                readOnly
                                value={form.userFullName || form.userId}
                                placeholder="Auto-filled when booking is selected"
                                className={readonlyCls}
                            />
                        </div>

                        {/* Amount (auto-filled, read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                                Amount (₹)
                                <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-zinc-500">(auto-filled from booking)</span>
                            </label>
                            <input
                                readOnly
                                value={form.amount ? `₹${Number(form.amount).toLocaleString("en-IN")}` : ""}
                                placeholder="Auto-filled when booking is selected"
                                className={readonlyCls}
                            />
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                                Payment Method <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="paymentMethod"
                                required
                                value={form.paymentMethod}
                                onChange={handleChange}
                                className={inputCls}
                            >
                                <option value="">Select method</option>
                                <option value="UPI">UPI</option>
                                <option value="Card">Card</option>
                                <option value="NetBanking">NetBanking</option>
                                <option value="Cash">Cash</option>
                            </select>
                        </div>

                        {/* Transaction ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                                Transaction ID
                                <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-zinc-500">(auto-generated if left blank)</span>
                            </label>
                            <input
                                name="transactionId"
                                placeholder="e.g. TXN123456789"
                                value={form.transactionId}
                                onChange={handleChange}
                                className={inputCls}
                            />
                        </div>

                        {/* Remarks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                                Remarks
                            </label>
                            <input
                                name="remarks"
                                placeholder="Optional notes"
                                value={form.remarks}
                                onChange={handleChange}
                                className={inputCls}
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
                                    : isEdit ? "Update Payment" : "Create Payment"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/payments")}
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
