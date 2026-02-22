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

  // 🔹 Fetch users & roles
  const fetchData = async () => {
    try {
      const usersRes = await API.get("/Users");
      const rolesRes = await API.get("/Roles");

      setUsers(usersRes.data);
      setRoles(rolesRes.data);

    } catch (err) {
      console.log("Fetch Error:", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Start edit
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

  // 🔹 Add user
  const addUser = async () => {
    try {
      await API.post("/Users", {
        ...form,
        roleId: parseInt(form.roleId)
      });

      setForm({ fullName: "", email: "", password: "", phone: "", roleId: "" });
      fetchData();

    } catch (err) {
      console.log("Add Error:", err.response?.data || err);
      alert("User creation failed");
    }
  };

  // 🔹 Update user
  const saveUpdatedUser = async () => {
    try {
      await API.put(`/Users/${editUserId}`, {
        ...form,
        password: form.password || "123456",
        roleId: parseInt(form.roleId)
      });

      setEditUserId(null);
      setForm({ fullName: "", email: "", password: "", phone: "", roleId: "" });
      fetchData();

    } catch (err) {
      console.log("Update Error:", err.response?.data || err);
      alert("Update failed");
    }
  };

  // 🔹 Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await API.delete(`/Users/${id}`);
      fetchData();
    } catch (err) {
      console.log("Delete Error:", err.response?.data || err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">Users</h2>

      {/* 🔹 FORM */}
      <div className="bg-gray-900 p-6 rounded-xl shadow mb-8 border border-gray-800">
        <h3 className="text-lg font-semibold mb-4">
          {editUserId ? "Edit User" : "Add User"}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 border border-gray-700"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 border border-gray-700"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 border border-gray-700"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 border border-gray-700"
          />

          <select
            name="roleId"
            value={form.roleId}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 border border-gray-700 col-span-2"
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.roleId} value={r.roleId}>
                {r.roleName}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={editUserId ? saveUpdatedUser : addUser}
          className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {editUserId ? "Update User" : "Add User"}
        </button>
      </div>

      {/* 🔹 USER LIST */}
      <div className="grid gap-4">
        {users.map((u) => (
          <div
            key={u.userId}
            className="bg-gray-900 p-4 rounded-lg border border-gray-800"
          >
            <p><b>Name:</b> {u.fullName}</p>
            <p><b>Email:</b> {u.email}</p>
            <p><b>Role:</b> {u.role?.roleName}</p>

            <div className="mt-3">
              <button
                onClick={() => startEditUser(u)}
                className="bg-yellow-500 px-3 py-1 rounded text-black mr-2"
              >
                Edit
              </button>

              <button
                onClick={() => deleteUser(u.userId)}
                className="bg-red-600 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}