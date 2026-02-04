import { useEffect, useState } from "react";
import API from "../services/api";

//useref is react hook je component ma mutable reference create karva mate use thay che, je component ni lifecycle ma persist rahe che
//for removing file input value after form submission
import { useRef } from "react";

export default function FacilityImages() {
  const [images, setImages] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [form, setForm] = useState({
    facilityId: "",
    imageFile: null
  });
  const [editImageId, setEditImageId] = useState(null);

  //aa function file ma hovu joiye jethi file input ne reset kari sakiye, not outside the component
  const fileInputRef = useRef(null);

  useEffect(() => {
    API.get("/FacilityImages")
      .then(res => setImages(res.data))
      .catch(err => console.log("Images error", err));

    API.get("/Facilities")
      .then(res => setFacilities(res.data))
      .catch(err => console.log("Facilities error", err));
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "imageFile") {
      setForm({ ...form, imageFile: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addImage = async () => {
    const data = new FormData();
    data.append("facilityId", form.facilityId);
    data.append("imageFile", form.imageFile);

    try {
      await API.post("/FacilityImages", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setForm({ facilityId: "", imageFile: null });

      //image add thay pachi input clear karva mate
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      const res = await API.get("/FacilityImages");
      setImages(res.data);

    } catch (err) {
      console.log("Upload Error", err.response?.data || err);
      alert("Image upload failed");
    }
  };

  //start edit image is called when user clicks edit button
  const startEditImage = (img) => {
    setEditImageId(img.imageId);
    setForm({
      facilityId: img.facilityId,
      imageFile: null
    });
  };

  //this function is called when user clicks update button
  const updateImage = async () => {
    const data = new FormData();
    data.append("facilityId", form.facilityId);
    if (form.imageFile) {
      data.append("imageFile", form.imageFile);
    }

    try {
      await API.put(`/FacilityImages/${editImageId}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setForm({ facilityId: "", imageFile: null });
      setEditImageId(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      const res = await API.get("/FacilityImages");
      setImages(res.data);

    } catch (err) {
      console.log("Update Image Error", err.response?.data || err);
      alert("Update failed");
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Delete image?")) return;

    try {
      await API.delete(`/FacilityImages/${id}`);

      const res = await API.get("/FacilityImages");
      setImages(res.data);

    } catch (err) {
      console.log("Delete Error", err.response?.data || err);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Facility Images</h2>
      <p className="text-zinc-400 mt-1">Manage facility images</p>

      <h3 className="mt-4">{editImageId ? "Update Image" : "Add Facility Image"}</h3>

      <select
        name="facilityId"
        value={form.facilityId}
        onChange={handleChange}
        className="border p-2 mr-2"
      >
        <option value="">Select Facility</option>
        {facilities.map(f => (
          <option key={f.facilityId} value={f.facilityId}>{f.name}</option>
        ))}
      </select>

      <input
        type="file"
        name="imageFile"
        ref={fileInputRef}
        onChange={handleChange}
        className="border p-2 mr-2"
      />

      {editImageId ? (
        <button onClick={updateImage} className="bg-yellow-500 text-black px-3 py-2 rounded">
          Update Image
        </button>
      ) : (
        <button onClick={addImage} className="bg-blue-600 text-white px-3 py-2 rounded">
          Upload Image
        </button>
      )}

      <div className="mt-5 space-y-3">
        {images.length === 0 ? (
          <p>No images found</p>
        ) : (
          images.map((img) => (
            <div
              key={img.imageId}
              className="border border-zinc-800 rounded-xl p-4"
            >
              <p><b>ImageId:</b> {img.imageId}</p>
              <p><b>Facility:</b> {img.facilityName}</p>
              <p><b>Category:</b> {img.category}</p>

              {img.imageUrl && (
                <img
                  src={`http://localhost:5203/${img.imageUrl}`}
                  alt="facility"
                  className="mt-3 h-40 w-full rounded-xl object-cover border border-zinc-800"
                />
              )}

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => startEditImage(img)}
                  className="bg-yellow-500 text-black px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteImage(img.imageId)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}