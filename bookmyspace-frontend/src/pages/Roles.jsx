import { useEffect, useState } from "react";
import API from "../services/api";

export default function Roles() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    API.get("/Roles")
      .then((res) => setRoles(res.data))
      .catch((err) => console.log("Roles Error:", err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold">Roles</h2>
      <p className="text-zinc-400 mt-1">GetAll roles</p>

      <div className="mt-5 space-y-3">
        {roles.length === 0 ? (
          <p>No roles found</p>
        ) : (
          roles.map((r) => (
            <div
              key={r.roleId}
              className="border border-zinc-800 rounded-xl p-4"
            >
              <p><b>RoleId:</b> {r.roleId}</p>
              <p><b>Name:</b> {r.roleName || r.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}