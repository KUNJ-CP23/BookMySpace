import { useEffect, useState } from "react";
import API from "../services/api";

export default function Roles() {
  //this is for storing roles fetched from backend
  const [roles, setRoles] = useState([]);

  //this is for storing new role name input
  const [roleName, setRoleName] = useState("");

  //fetches roles from backend on component mount
  useEffect(() => {
    API.get("/Roles")
      .then((res) => setRoles(res.data))
      .catch((err) => console.log("Roles Error:", err));
  }, []);

  //function to add a new role
  const addRole = async () => {
    if(!roleName.trim()){
      alert("Role name cannot be empty");
      return;
    }
    try{
      await API.post("/Roles", { 
        roleName: roleName //backend na Dto ne match karva
      });
      setRoleName("");
      // Refresh roles list
      const res =  await API.get("/Roles");
      setRoles(res.data);
    }
    catch(err){
      console.log("Add Role Error:", err);
    }
  };

  //update role function
  const updateRole = async (id, currentName) => {
  const newName = prompt("Enter new role name", currentName);

  if (!newName || !newName.trim()) return;

  try {
    await API.put(`/Roles/${id}`, {
      RoleName: newName
    });

    // refresh roles
    const res = await API.get("/Roles");
    setRoles(res.data);

  } catch (err) {
    console.log("Update Role Error:", err);
  }
};

//delete role
const deleteRole = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this role?");
  if (!confirmDelete) return;

  try {
    await API.delete(`/Roles/${id}`);

    // refresh list after delete
    const res = await API.get("/Roles");
    setRoles(res.data);

  } catch (err) {
    console.log("Delete Role Error:", err.response?.data || err);
    alert("Delete failed");
  }
};

  return (
    <div>
      <h2 className="text-2xl font-semibold">Roles</h2>
      <p className="text-zinc-400 mt-1">GetAll roles</p>

      <div className="mt-5">
        <input
          type="text"
          placeholder="Enter role name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={addRole} className="bg-blue-600 text-white px-3 py-2 rounded">
          Add Role
        </button>
      </div>
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
             
              <button
                onClick={() => updateRole(r.roleId, r.roleName || r.name)}
                className="mt-2 bg-yellow-500 text-black px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteRole(r.roleId)}
                className="mt-2 ml-2 bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}