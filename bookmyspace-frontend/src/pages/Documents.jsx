import { useEffect, useState } from "react";
import API from "../services/api";

export default function Documents() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    API.get("/Documents")
      .then((res) => setDocs(res.data))
      .catch((err) => console.log("Documents Error:", err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold">Documents</h2>
      <p className="text-zinc-400 mt-1">GetAll documents</p>

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
              <p><b>UserId:</b> {d.userId}</p>
              <p><b>Type:</b> {d.documentType}</p>
              <p><b>File:</b> {d.fileName || d.documentPath}</p>
              <p><b>CreatedAt:</b> {String(d.createdAt)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}