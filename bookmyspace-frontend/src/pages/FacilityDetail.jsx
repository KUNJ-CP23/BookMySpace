import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function FacilityDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [facility, setFacility] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState(null); // index of enlarged image

    // ── Documents state ──────────────────────────────────────────────────────
    const [docs, setDocs] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef();

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [facilitiesRes, imagesRes, docsRes] = await Promise.all([
                    API.get("/Facilities"),
                    API.get(`/Facilities/${id}/images`),
                    API.get("/Documents").catch(() => ({ data: [] })),
                ]);
                const found = facilitiesRes.data.find((f) => String(f.facilityId) === String(id));
                if (!found) {
                    alert("Facility not found.");
                    navigate("/facilities");
                    return;
                }
                setFacility(found);
                setImages(imagesRes.data || []);
                const facilityDocs = (docsRes.data || []).filter(
                    (d) => String(d.facilityId) === String(id)
                );
                setDocs(facilityDocs);
            } catch (err) {
                console.log("Detail load error:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Delete this facility? This action cannot be undone.")) return;
        try {
            await API.delete(`/Facilities/${id}`);
            navigate("/facilities");
        } catch (err) {
            console.log("Delete error:", err.response?.data || err);
            alert("Delete failed.");
        }
    };

    const refreshDocs = async () => {
        try {
            const res = await API.get("/Documents");
            setDocs((res.data || []).filter((d) => String(d.facilityId) === String(id)));
        } catch (err) {
            console.log("Docs refresh error:", err);
        }
    };

    const uploadDocument = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("facilityId", id);
            formData.append("documentType", file.type || "document");
            formData.append("file", file);
            await API.post("/Documents", formData);
            await refreshDocs();
        } catch (err) {
            console.log("Upload error:", err.response?.data || err);
            alert("Upload failed.");
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const deleteDocument = async (docId) => {
        if (!window.confirm("Delete this document?")) return;
        try {
            await API.delete(`/Documents/${docId}`);
            await refreshDocs();
        } catch (err) {
            console.log("Delete doc error:", err.response?.data || err);
            alert("Delete failed.");
        }
    };

    const canManageDocs =
        role === "Admin" ||
        (role === "Owner" && String(facility?.userId) === String(user?.userId));

    if (loading) {
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

    if (!facility) return null;

    const imgUrl = (url) => `http://localhost:5203/${url}`;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-zinc-100 p-6 lg:p-8">

            {/* ── Back + Actions ─────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate("/facilities")}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Facilities
                </button>

                {(role === "Admin" || role === "Owner") && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate(`/facilities/form/${id}`)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 hover:shadow-sm text-amber-700 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 dark:text-amber-400 text-sm font-medium transition-all duration-150 cursor-pointer"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 hover:shadow-sm text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 text-sm font-medium transition-all duration-150 cursor-pointer"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* ── Main Detail Card ────────────────────────────────────── */}
            <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden mb-6">

                {/* Hero image */}
                {images.length > 0 && (
                    <div className="h-64 sm:h-80 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                        <img
                            src={imgUrl(images[0].imageUrl)}
                            alt={facility.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="p-6 sm:p-8">
                    {/* Title + badges */}
                    <div className="flex flex-wrap items-start gap-3 mb-5">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{facility.name}</h1>
                            {facility.user?.fullName && (
                                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
                                    Owner: <span className="font-medium text-gray-700 dark:text-zinc-200">{facility.user.fullName}</span>
                                </p>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                                {facility.category || "—"}
                            </span>
                            {facility.isGovOwned ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                    Government
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    Private
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Info grid */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        {[
                            {
                                icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
                                label: "City", value: facility.city,
                            },
                            {
                                icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                                label: "Address", value: facility.address,
                            },
                            {
                                icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
                                label: "Price per Hour", value: facility.pricePerHour ? `₹${Number(facility.pricePerHour).toLocaleString("en-IN")}` : null,
                            },
                            {
                                icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                                label: "Contact", value: facility.contact,
                            },
                        ].map(({ icon, label, value }) => value && (
                            <div key={label} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/50">
                                <svg className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                                </svg>
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-zinc-500">{label}</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-zinc-100">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    {facility.description && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">About</h3>
                            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">{facility.description}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Image Gallery ───────────────────────────────────────── */}
            {images.length > 0 && (
                <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-6 sm:p-8">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                        Gallery <span className="text-gray-400 dark:text-zinc-500 font-normal text-sm">({images.length})</span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {images.map((img, idx) => (
                            <button
                                key={img.imageId}
                                onClick={() => setLightbox(idx)}
                                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <img
                                    src={imgUrl(img.imageUrl)}
                                    alt={`Facility image ${idx + 1}`}
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Documents ────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-6 sm:p-8 mt-6">
                {/* Section header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        Documents
                        <span className="ml-2 text-gray-400 dark:text-zinc-500 font-normal text-sm">({docs.length})</span>
                    </h2>
                    {canManageDocs && (
                        <>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="*/*"
                                className="hidden"
                                onChange={uploadDocument}
                            />
                            <button
                                onClick={() => fileRef.current?.click()}
                                disabled={uploading}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold shadow-sm transition-all duration-150 cursor-pointer"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                {uploading ? "Uploading…" : "Upload Document"}
                            </button>
                        </>
                    )}
                </div>

                {docs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-zinc-600">
                        <svg className="h-10 w-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm">No documents uploaded yet.</p>
                        {canManageDocs && (
                            <p className="text-xs mt-1 text-gray-400 dark:text-zinc-600">Click "Upload Document" to add one.</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {docs.map((d) => {
                            const fileName = d.fileUrl?.split("/").pop() || d.documentType || "Document";
                            const uploaded = d.uploadedAt
                                ? new Date(d.uploadedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                                : "—";
                            return (
                                <div
                                    key={d.documentId}
                                    className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-gray-100 dark:border-zinc-700/60 bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-150"
                                >
                                    {/* File icon */}
                                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    {/* Name + date */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 dark:text-zinc-100 truncate">{fileName}</p>
                                        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Uploaded {uploaded}</p>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {d.fileUrl && (
                                            <a
                                                href={`http://localhost:5203/${d.fileUrl}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                download
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-medium transition-all duration-150"
                                            >
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Download
                                            </a>
                                        )}
                                        {canManageDocs && (
                                            <button
                                                onClick={() => deleteDocument(d.documentId)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-medium transition-all duration-150 cursor-pointer"
                                            >
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Lightbox ────────────────────────────────────────────── */}
            {lightbox !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={imgUrl(images[lightbox].imageUrl)}
                            alt="Enlarged"
                            className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                        />
                        {/* Close */}
                        <button
                            onClick={() => setLightbox(null)}
                            className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {/* Prev */}
                        {lightbox > 0 && (
                            <button
                                onClick={() => setLightbox(lightbox - 1)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        {/* Next */}
                        {lightbox < images.length - 1 && (
                            <button
                                onClick={() => setLightbox(lightbox + 1)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                        {/* Counter */}
                        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/70 bg-black/40 px-3 py-1 rounded-full">
                            {lightbox + 1} / {images.length}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
