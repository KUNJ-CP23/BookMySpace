import { useEffect, useState, useRef } from "react";
import API from "../services/api";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const fileRef = useRef();

  const [form, setForm] = useState({
    facilityId: "",
    documentType: "",
    file: null
  });

  const [editDocId, setEditDocId] = useState(null);

  // get
  useEffect(() => {
    API.get("/Documents")
      .then((res) => setDocs(res.data))
      .catch((err) => console.log("Documents Error:", err));

    API.get("/Facilities")
      .then((res) => setFacilities(res.data))
      .catch((err) => console.log("Facilities Error:", err));
  }, []);

  const refreshDocs = async () => {
    const res = await API.get("/Documents");
    setDocs(res.data);
  };

  // changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
      facilityId: "",
      documentType: "",
      file: null
    });

    // 🔥 IMPORTANT FIX
    if (fileRef.current) {
      fileRef.current.value = "";
    }

    setEditDocId(null);
  };

  // add
  const addDocument = async () => {
    try {
      const formData = new FormData();
      formData.append("facilityId", form.facilityId);
      formData.append("documentType", form.documentType);
      formData.append("file", form.file);

      await API.post("/Documents", formData);

      refreshDocs();
      resetForm();

      // optional safety reset
      if (fileRef.current) fileRef.current.value = "";

    } catch (err) {
      console.log("Add Document Error:", err.response?.data || err);
      alert("Failed to add document");
    }
  };

  // edit
  const startEdit = (d) => {
    setEditDocId(d.documentId);

    setForm({
      facilityId: d.facilityId,
      documentType: d.documentType,
      file: null
    });
  };

  // actual update
  const updateDocument = async () => {
    try {
      const formData = new FormData();
      formData.append("facilityId", form.facilityId);
      formData.append("documentType", form.documentType);

      if (form.file) {
        formData.append("file", form.file);
      }

      await API.put(`/Documents/${editDocId}`, formData);

      refreshDocs();
      resetForm();

      if (fileRef.current) fileRef.current.value = "";

    } catch (err) {
      console.log("Update Error:", err.response?.data || err);
      alert("Update failed");
    }
  };

  // delete
  const deleteDocument = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    await API.delete(`/Documents/${id}`);
    refreshDocs();
  };

  // ui
  return (
    <div style={{ padding: 20 }}>
      <h2 className="text-2xl font-semibold">Documents</h2>
      <p className="text-zinc-400 mt-1">GetAll + CRUD Documents</p>

      {/* ===== FORM ===== */}
      <h3>{editDocId ? "Edit Document" : "Add Document"}</h3>

      <div style={{ border: "1px solid #aaa", padding: 15, marginBottom: 20 }}>
        
        <select name="facilityId" value={form.facilityId} onChange={handleChange}>
          <option value="">Select Facility</option>
          {facilities.map(f => (
            <option key={f.facilityId} value={f.facilityId}>
              {f.name}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          name="documentType"
          placeholder="Document Type"
          value={form.documentType}
          onChange={handleChange}
        />

        <br /><br />

        <input type="file" name="file" ref={fileRef} onChange={handleChange} />

        <br /><br />

        {editDocId ? (
          <>
            <button onClick={updateDocument}>Update</button>
            <button onClick={resetForm} style={{ marginLeft: 10 }}>Cancel</button>
          </>
        ) : (
          <button onClick={addDocument}>Upload</button>
        )}
      </div>

      {/* ===== LIST ===== */}
      <div className="mt-5 space-y-3">
        {docs.length === 0 ? (
          <p>No documents found</p>
        ) : (
          docs.map((d) => (
            <div
              key={d.documentId}
              className="border border-zinc-800 rounded-xl p-4"
            >
              <p><b>DocumentId:</b> {d.documentId}</p>
              <p><b>Facility:</b> {d.facility?.name || d.facilityId}</p>
              <p><b>Type:</b> {d.documentType}</p>

              {d.fileUrl && (
                <p>
                  <b>File:</b>{" "}
                  <a
                    href={`http://localhost:5203/${d.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View File
                  </a>
                </p>
              )}

              <p><b>Uploaded:</b> {new Date(d.uploadedAt).toLocaleString()}</p>

              <button onClick={() => deleteDocument(d.documentId)} style={{ marginLeft: 10 }}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}