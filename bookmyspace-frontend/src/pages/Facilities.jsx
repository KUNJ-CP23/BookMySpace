import { useEffect, useState } from "react";
import API from "../services/api";

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    description: "",
    city: "",
    address: "",
    categoty: "",
    pricePerHour: "",
    isGovOwned: false,
    userId: ""
  });
  const startEditFacility = (f) => {
    setEditFacilityId(f.facilityId);
    setForm({
      name: f.name || "",
      contact: f.contact || "",
      description: f.description || "",
      city: f.city || "",
      address: f.address || "",
      category: f.category || "",
      pricePerHour: f.pricePerHour || "",
      isGovOwned: f.isGovOwned || false,
      userId: f.userId || ""
    });
  };

  const updateFacility = async () => {
    try {
      await API.put(`/Facilities/${editFacilityId}`, {
        name: form.name,
        contact: form.contact,
        description: form.description,
        city: form.city,
        address: form.address,
        category: form.category,
        pricePerHour: parseFloat(form.pricePerHour),
        isGovOwned: form.isGovOwned,
        userId: parseInt(form.userId)
      });

      setEditFacilityId(null);
      setForm({
        name: "",
        contact: "",
        description: "",
        city: "",
        address: "",
        category: "",
        pricePerHour: "",
        isGovOwned: false,
        userId: ""
      });

      const res = await API.get("/Facilities");
      setFacilities(res.data);

    } catch (err) {
      console.log("Update Facility Error", err.response?.data || err);
      alert("Update failed");
    }
  };

  const deleteFacility = async (id) => {
    if (!window.confirm("Delete this facility?")) return;

    try {
      await API.delete(`/Facilities/${id}`);

      const res = await API.get("/Facilities");
      setFacilities(res.data);

    } catch (err) {
      console.log("Delete Facility Error", err.response?.data || err);
      alert("Delete failed");
    }
  };

  const [editFacilityId, setEditFacilityId] = useState(null);

  useEffect(() => {
    API.get("/Facilities")
      .then((res) => setFacilities(res.data))
      .catch((err) => console.log("Facilities Error:", err));
    //fetch users
    API.get("/Users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log("Users Error:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const addFacility = async () => {
    try {
      await API.post("/Facilities", {
        name: form.name,
        contact: form.contact,
        description: form.description,
        city: form.city,
        address: form.address,
        category: form.category,
        pricePerHour: parseFloat(form.pricePerHour),
        isGovOwned: form.isGovOwned,
        userId: parseInt(form.userId)
      });

      setForm({
        name: "",
        contact: "",
        description: "",
        city: "",
        address: "",
        category: "",
        pricePerHour: "",
        isGovOwned: false,
        userId: ""
      });

      const res = await API.get("/Facilities");
      setFacilities(res.data);

    } catch (err) {
      console.log("Add Facility Error:", err.response?.data || err);
      alert("Failed to add facility");
    }
  };



  return (
    <div style={{ padding: 20 }}>
      <h2>Facilities</h2>

      <h3>Add Facility</h3>

      <input name="name" placeholder="Facility Name" value={form.name} onChange={handleChange} />
      <input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      <input name="pricePerHour" placeholder="Price Per Hour" value={form.pricePerHour} onChange={handleChange} />

      <label>
        <input
          type="checkbox"
          name="isGovOwned"
          checked={form.isGovOwned}
          onChange={handleChange}
        />
        Government Owned
      </label>
      <select name="userId" value={form.userId} onChange={handleChange}>
        <option value="">Select Owner</option>
        {users.map(u => (
          <option key={u.userId} value={u.userId}>
            {u.fullName}
          </option>
        ))}
      </select>

      {editFacilityId ? (
        <button onClick={updateFacility}>Update Facility</button>
      ) : (
        <button onClick={addFacility}>Add Facility</button>
      )}

      {facilities.length === 0 ? (
        <p>No facilities found</p>
      ) : (
        facilities.map((f) => (
          <div
            key={f.facilityId}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 12,
              borderRadius: 6
            }}
          >
            <p><b>Name:</b> {f.name}</p>
            <p><b>Contact:</b> {f.contact}</p>
            <p><b>Description:</b> {f.description}</p>
            <p><b>City:</b> {f.city}</p>
            <p><b>Address:</b> {f.address}</p>
            <p><b>Category:</b> {f.category}</p>
            <p>
              <b>Price / Hour:</b>{" "}
              ₹{Number(f.pricePerHour).toLocaleString("en-IN")}
            </p>
            <p><b>Ownership:</b> {f.isGovOwned ? "Government" : "Private"}</p>
            <p><b>UserId:</b> {f.userId}</p>

            <button onClick={() => startEditFacility(f)} style={{ marginRight: 10, background: "yellow", color: "black"}}>
              Edit
            </button>

            <button 
              onClick={() => deleteFacility(f.facilityId)} 
              style={{ background: "crimson", color: "white" }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}