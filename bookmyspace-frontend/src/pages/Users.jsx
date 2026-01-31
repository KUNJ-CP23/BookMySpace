import { useEffect, useState } from "react";
import API from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/Users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Users</h2>

      {users.map((u) => (
        <div key={u.userId} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <p><b>Name:</b> {u.fullName}</p>
          <p><b>Email:</b> {u.email}</p>
        </div>
      ))}
    </div>
  );
}