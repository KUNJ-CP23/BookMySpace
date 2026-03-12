import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function FacilityForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    const emptyForm = {
        name: "",
        contact: "",
        description: "",
        city: "",
        address: "",
        category: "",
        pricePerHour: "",
        isGovOwned: false,
        userId: "",
    };

    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        const loadData = async () => {
            try {
                const userRes = await API.get("/Users").catch(() => ({ data: [] }));
                setUsers(userRes.data);

                if (isEdit) {
                    const res = await API.get("/Facilities");
                    const facility = res.data.find((f) => String(f.facilityId) === String(id));
                    if (facility) {
                        setForm({
                            name: facility.name || "",
                            contact: facility.contact || "",
                            description: facility.description || "",
                            city: facility.city || "",
                            address: facility.address || "",
                            category: facility.category || "",
                            pricePerHour: facility.pricePerHour || "",
                            isGovOwned: facility.isGovOwned || false,
                            userId: facility.userId || facility.user?.userId || "",
                        });
                    } else {
                        alert("Facility not found.");
                        navigate("/facilities");
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...form,
                pricePerHour: parseFloat(form.pricePerHour),
                userId: parseInt(form.userId),
            };
            if (isEdit) {
                await API.put(`/Facilities/${id}`, payload);
            } else {
                await API.post("/Facilities", payload);
            }
            navigate("/facilities");
        } catch (err) {
            console.log("Submit error:", err.response?.data || err);
            alert(isEdit ? "Update failed. Please try again." : "Failed to add facility. Please check the details.");
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
                    Loading facility…
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
                        onClick={() => navigate("/facilities")}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            {isEdit ? "Edit Facility" : "Add Facility"}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
                            {isEdit ? "Update the details for this facility" : "Fill in the details to list a new facility"}
                        </p>
                    </div>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Name */}
                        <div>
                            <label className={labelCls}>Facility Name <span className="text-red-500">*</span></label>
                            <input name="name" required placeholder="e.g. City Sports Complex" value={form.name} onChange={handleChange} className={inputCls} />
                        </div>

                        {/* City + Address */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>City <span className="text-red-500">*</span></label>
                                <input name="city" required placeholder="e.g. Ahmedabad" value={form.city} onChange={handleChange} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Address</label>
                                <input name="address" placeholder="Street / landmark" value={form.address} onChange={handleChange} className={inputCls} />
                            </div>
                        </div>

                        {/* Category + Price */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Category <span className="text-red-500">*</span></label>
                                <input name="category" required placeholder="e.g. Sports, Conference" value={form.category} onChange={handleChange} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Price per Hour (₹) <span className="text-red-500">*</span></label>
                                <input name="pricePerHour" required type="number" min="0" placeholder="e.g. 500" value={form.pricePerHour} onChange={handleChange} className={inputCls} />
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <label className={labelCls}>Contact</label>
                            <input name="contact" placeholder="e.g. +91 98765 43210" value={form.contact} onChange={handleChange} className={inputCls} />
                        </div>

                        {/* Description */}
                        <div>
                            <label className={labelCls}>Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                placeholder="Brief description of the facility…"
                                value={form.description}
                                onChange={handleChange}
                                className={`${inputCls} resize-none`}
                            />
                        </div>

                        {/* Owner */}
                        <div>
                            <label className={labelCls}>Owner <span className="text-red-500">*</span></label>
                            <select name="userId" required value={form.userId} onChange={handleChange} className={inputCls}>
                                <option value="">Select an owner</option>
                                {users.map((u) => (
                                    <option key={u.userId} value={u.userId}>{u.fullName}</option>
                                ))}
                            </select>
                        </div>

                        {/* Is Government Owned */}
                        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/60">
                            <input
                                type="checkbox"
                                id="isGovOwned"
                                name="isGovOwned"
                                checked={form.isGovOwned}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor="isGovOwned" className="text-sm font-medium text-gray-700 dark:text-zinc-300 cursor-pointer select-none">
                                Government-owned facility
                            </label>
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
                                    : isEdit ? "Update Facility" : "Create Facility"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/facilities")}
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
