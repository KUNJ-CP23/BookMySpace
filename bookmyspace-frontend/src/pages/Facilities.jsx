import { useEffect, useState } from "react";
import API from "../services/api";

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [images, setImages] = useState([]);
  const [editFacilityId, setEditFacilityId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [form, setForm] = useState({
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/Facilities");
      setFacilities(res.data);

      const userRes = await API.get("/Users").catch(() => null);
      if (userRes) setUsers(userRes.data);

    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // 🔥 VIEW DETAILS (IMAGES)
  const viewDetails = async (facility) => {
    setSelectedFacility(facility);

    try {
      const res = await API.get(`/Facilities/${facility.facilityId}/images`);
      setImages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 ADD
  const addFacility = async () => {
    try {
      await API.post("/Facilities", {
        ...form,
        pricePerHour: parseFloat(form.pricePerHour),
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

      fetchData();
    } catch (err) {
      alert("Failed to add facility");
    }
  };

  // 🔥 EDIT
  const startEditFacility = (f) => {
    setEditFacilityId(f.facilityId);
    setForm({ ...f });
  };

  const updateFacility = async () => {
    try {
      await API.put(`/Facilities/${editFacilityId}`, {
        ...form,
        pricePerHour: parseFloat(form.pricePerHour)
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

      fetchData();
    } catch {
      alert("Update failed");
    }
  };

  // 🔥 DELETE
  const deleteFacility = async (id) => {
    if (!window.confirm("Delete this facility?")) return;

    await API.delete(`/Facilities/${id}`);
    fetchData();
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">Facilities</h2>

      {/* 🔥 ADD / EDIT FORM (ADMIN + OWNER ONLY) */}
      {(role === "Admin" || role === "Owner") && (
        <div className="bg-zinc-900 p-4 rounded-xl mb-6 border border-zinc-800">
          <h3 className="mb-3">{editFacilityId ? "Edit" : "Add"} Facility</h3>

          <div className="grid grid-cols-2 gap-3">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="input" />
            <input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} className="input" />
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="input" />
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="input" />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="input" />
            <input name="pricePerHour" placeholder="Price" value={form.pricePerHour} onChange={handleChange} className="input" />
          </div>

          <button
            onClick={editFacilityId ? updateFacility : addFacility}
            className="mt-3 bg-blue-600 px-4 py-2 rounded"
          >
            {editFacilityId ? "Update" : "Add"}
          </button>
        </div>
      )}

      {/* 🔥 LIST */}
      <div className="grid md:grid-cols-3 gap-4">
        {facilities.map((f) => (
          <div key={f.facilityId} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <h3 className="font-bold">{f.name}</h3>
            <p className="text-sm text-gray-400">{f.city}</p>
            <p>₹{f.pricePerHour}</p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => viewDetails(f)}
                className="bg-blue-600 px-3 py-1 rounded"
              >
                View
              </button>

              {(role === "Admin" || role === "Owner") && (
                <>
                  <button
                    onClick={() => startEditFacility(f)}
                    className="bg-yellow-500 px-3 py-1 rounded text-black"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteFacility(f.facilityId)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 MODAL */}
      {selectedFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl w-[600px]">
            <h2 className="text-xl font-bold mb-3">{selectedFacility.name}</h2>

            <div className="grid grid-cols-3 gap-2">
              {images.length > 0 ? (
                images.map((img) => (
                  <img
                    key={img.imageId}
                    src={img.imageUrl}
                    className="h-24 w-full object-cover rounded"
                  />
                ))
              ) : (
                <p>No images</p>
              )}
            </div>

            <button
              onClick={() => setSelectedFacility(null)}
              className="mt-4 bg-red-600 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}