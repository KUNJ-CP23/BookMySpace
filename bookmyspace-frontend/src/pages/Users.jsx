import { useEffect, useState } from "react";
import API from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    roleId: ""
  });
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    //fetch users
    API.get("/Users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log("Users Error:", err));

    //fetch roles
    API.get("/Roles")
      .then((res) => setRoles(res.data))
      .catch((err) => console.log("Roles Error:", err));
  }, []);

  //this is for handling form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Start editing user
  const startEditUser = (user) => {
    setEditUserId(user.userId);
    setForm({
      fullName: user.fullName,
      email: user.email,
      password: "",
      phone: user.phone || "",
      roleId: user.roleId || user.role?.roleId || ""
    });
  };

  //add user
  const addUser = async () => {
    try {
      await API.post("/Users", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        roleId: parseInt(form.roleId)
      });

      // Clear form
      setForm({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        roleId: ""
      });

      // Refresh user list
      const res = await API.get("/Users");
      setUsers(res.data);

    } catch (err) {
      console.log("Add User Error:", err.response?.data || err);
      alert("User creation failed");
    }
  };

  // Save updated user
  const saveUpdatedUser = async () => {
    try {
      await API.put(`/Users/${editUserId}`, {
        fullName: form.fullName,
        email: form.email,
        password: form.password || "123456",
        phone: form.phone,
        roleId: parseInt(form.roleId)
      });

      setEditUserId(null);
      setForm({ fullName: "", email: "", password: "", phone: "", roleId: "" });

      const res = await API.get("/Users");
      setUsers(res.data);

    } catch (err) {
      console.log("Update User Error:", err.response?.data || err);
      alert("Update failed");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/Users/${id}`);

      const res = await API.get("/Users");
      setUsers(res.data);

    } catch (err) {
      console.log("Delete User Error:", err.response?.data || err);
      alert("Delete failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Users</h2>

      <h3 style={{ marginTop: 20 }}>Add User</h3>
      <div style={{ marginBottom: 20 }}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 8 }}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 8 }}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 8 }}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 8 }}
        />

        <select
          name="roleId"
          value={form.roleId}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 8 }}
        >
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r.roleId} value={r.roleId}>
              {r.roleName}
            </option>
          ))}
        </select>

        {editUserId ? (
          <button onClick={saveUpdatedUser}>Update User</button>
        ) : (
          <button onClick={addUser}>Add User</button>
        )}
      </div>

      {users.map((u) => (
        <div key={u.userId} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <p><b>Name:</b> {u.fullName}</p>
          <p><b>Email:</b> {u.email}</p>
          <p><b>Role:</b> {u.role?.roleName}</p>
          <button onClick={() => startEditUser(u)} style={{ marginTop: 8 }}>
            Edit
          </button>
          <button 
            onClick={() => deleteUser(u.userId)} 
            style={{ marginLeft: 10, background: "crimson", color: "white" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}