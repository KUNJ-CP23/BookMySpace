import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function formatTime(t) {
    if (!t) return "";
    // Handle "HH:MM:SS" → "HH:MM"
    return t.substring(0, 5);
}

export default function BookingForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    const empty = {
        userId: "", facilityId: "",
        startDate: "", endDate: "",
        startTime: "", endTime: "",
        totalPrice: "0",
        bookingStatus: "Pending",
        paymentMode: "Online",
        paymentStatus: "Unpaid",
    };
    const [form, setForm] = useState(empty);

    useEffect(() => {
        const load = async () => {
            try {
                const [userRes, facRes] = await Promise.all([
                    API.get("/Users").catch(() => ({ data: [] })),
                    API.get("/Facilities").catch(() => ({ data: [] })),
                ]);
                setUsers(userRes.data);
                setFacilities(facRes.data);

                if (isEdit) {
                    const res = await API.get("/Bookings");
                    const b = res.data.find((x) => String(x.bookingId) === String(id));
                    if (b) {
                        setForm({
                            userId: String(b.userId),
                            facilityId: String(b.facilityId),
                            startDate: b.startDate?.split("T")[0] || "",
                            endDate: b.endDate?.split("T")[0] || "",
                            startTime: formatTime(b.startTime),
                            endTime: formatTime(b.endTime),
                            totalPrice: String(b.totalPrice ?? 0),
                            bookingStatus: b.bookingStatus || "Pending",
                            paymentMode: b.paymentMode || "Online",
                            paymentStatus: b.paymentStatus || "Unpaid",
                        });
                    } else {
                        alert("Booking not found.");
                        navigate("/bookings");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                userId: parseInt(form.userId),
                facilityId: parseInt(form.facilityId),
                startDate: form.startDate,
                endDate: form.endDate,
                startTime: form.startTime ? form.startTime + ":00" : null,
                endTime: form.endTime ? form.endTime + ":00" : null,
                totalPrice: parseFloat(form.totalPrice) || 0,
                bookingStatus: form.bookingStatus,
                paymentMode: form.paymentMode,
                paymentStatus: form.paymentStatus,
            };
            if (isEdit) {
                await API.put(`/Bookings/${id}`, payload);
            } else {
                await API.post("/Bookings", payload);
            }
            navigate("/bookings");
        } catch (err) {
            console.log("Submit error:", err.response?.data || err);
            alert(isEdit ? "Update failed. Please try again." : "Failed to create booking.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
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
                        onClick={() => navigate("/bookings")}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            {isEdit ? "Edit Booking" : "Add Booking"}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
                            {isEdit ? "Update the details for this booking" : "Fill in the details to create a new booking"}
                        </p>
                    </div>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* User */}
                        <div>
                            <label className={labelCls}>User <span className="text-red-500">*</span></label>
                            <select name="userId" required value={form.userId} onChange={handleChange} className={inputCls}>
                                <option value="">Select a user</option>
                                {users.map((u) => <option key={u.userId} value={u.userId}>{u.fullName}</option>)}
                            </select>
                        </div>

                        {/* Facility */}
                        <div>
                            <label className={labelCls}>Facility <span className="text-red-500">*</span></label>
                            <select name="facilityId" required value={form.facilityId} onChange={handleChange} className={inputCls}>
                                <option value="">Select a facility</option>
                                {facilities.map((f) => <option key={f.facilityId} value={f.facilityId}>{f.name}</option>)}
                            </select>
                        </div>

                        {/* Start / End Date */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Start Date <span className="text-red-500">*</span></label>
                                <input type="date" name="startDate" required value={form.startDate} onChange={handleChange} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>End Date <span className="text-red-500">*</span></label>
                                <input type="date" name="endDate" required value={form.endDate} onChange={handleChange} className={inputCls} />
                            </div>
                        </div>

                        {/* Start / End Time */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Start Time <span className="text-red-500">*</span></label>
                                <input type="time" name="startTime" required value={form.startTime} onChange={handleChange} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>End Time <span className="text-red-500">*</span></label>
                                <input type="time" name="endTime" required value={form.endTime} onChange={handleChange} className={inputCls} />
                            </div>
                        </div>

                        {/* Total Price */}
                        <div>
                            <label className={labelCls}>Total Price (₹)</label>
                            <input type="number" name="totalPrice" min="0" step="0.01" value={form.totalPrice} onChange={handleChange} className={inputCls} />
                        </div>

                        {/* Booking Status */}
                        <div>
                            <label className={labelCls}>Booking Status</label>
                            <select name="bookingStatus" value={form.bookingStatus} onChange={handleChange} className={inputCls}>
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Payment Mode */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Payment Mode</label>
                                <select name="paymentMode" value={form.paymentMode} onChange={handleChange} className={inputCls}>
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>Payment Status</label>
                                <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} className={inputCls}>
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Refunded">Refunded</option>
                                </select>
                            </div>
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
                                    : isEdit ? "Update Booking" : "Create Booking"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/bookings")}
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
