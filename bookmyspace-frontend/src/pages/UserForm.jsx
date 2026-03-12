import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function UserForm() {
    const { id } = useParams();          // present → Edit mode
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        roleId: "",
    });

    // ── Load roles (always) + user data (edit mode only) ──────────────────────
    useEffect(() => {
        const loadData = async () => {
            try {
                const rolesRes = await API.get("/Roles");
                setRoles(rolesRes.data);

                if (isEdit) {
                    const usersRes = await API.get("/Users");
                    const user = usersRes.data.find((u) => String(u.userId) === String(id));
                    if (user) {
                        setForm({
                            fullName: user.fullName || "",
                            email: user.email || "",
                            password: "",
                            phone: user.phone || "",
                            roleId: user.roleId || user.role?.roleId || "",
                        });
                    } else {
                        alert("User not found.");
                        navigate("/users");
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

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await API.put(`/Users/${id}`, {
                    ...form,
                    password: form.password || "123456",
                    roleId: parseInt(form.roleId),
                });
            } else {
                await API.post("/Users", {
                    ...form,
                    roleId: parseInt(form.roleId),
                });
            }
            navigate("/users");
        } catch (err) {
            console.log("Submit error:", err.response?.data || err);
            alert(isEdit ? "Update failed. Please try again." : "User creation failed. Please check the details.");
        } finally {
            setLoading(false);
        }
    };

    // ── Loading skeleton (edit mode fetching) ─────────────────────────────────
    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
                <div className="flex items-center gap-2 text-gray-400 dark:text-zinc-500 text-sm">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Loading user…
                </div>
            </div>
        );
    }

    // ── Form ──────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-start justify-center px-4 py-12">
            <div className="w-full max-w-[560px]">

                {/* Back + Title */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        type="button"
                        onClick={() => navigate("/users")}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            {isEdit ? "Edit User" : "Add User"}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
                            {isEdit
                                ? "Update the details for this user"
                                : "Fill in the details to create a new user account"}
                        </p>
                    </div>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="fullName"
                                required
                                placeholder="e.g. John Doe"
                                value={form.fullName}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="e.g. john@example.com"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                                Password
                                {isEdit && (
                                    <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-zinc-500">
                                        (leave blank to keep current)
                                    </span>
                                )}
                                {!isEdit && <span className="text-red-500"> *</span>}
                            </label>
                            <input
                                name="password"
                                type="password"
                                required={!isEdit}
                                placeholder={isEdit ? "New password (optional)" : "Create a strong password"}
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                                Phone
                            </label>
                            <input
                                name="phone"
                                placeholder="e.g. +91 98765 43210"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="roleId"
                                required
                                value={form.roleId}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            >
                                <option value="">Select a role</option>
                                {roles.map((r) => (
                                    <option key={r.roleId} value={r.roleId}>
                                        {r.roleName}
                                    </option>
                                ))}
                            </select>
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
                                    : isEdit ? "Update User" : "Create User"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/users")}
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
