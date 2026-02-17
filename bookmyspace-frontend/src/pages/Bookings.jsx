import { useEffect, useState } from "react";
import API from "../services/api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [facilities, setFacilities] = useState([]);


  const [form, setForm] = useState({
    facilityId: "",
    userId: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: ""
  });

  
  const [editBookingId, setEditBookingId] = useState(null);

  useEffect(() => {
    refreshBookings();
    API.get("/Users").then(res => setUsers(res.data));
    API.get("/Facilities").then(res => setFacilities(res.data));
  }, []);

  const refreshBookings = async () => {
    const res = await API.get("/Bookings");
    setBookings(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatTime = (time) => (time ? time + ":00" : null);

  const resetForm = () => {
    setForm({
      facilityId: "",
      userId: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: ""
    });
    setEditBookingId(null);
  };

  // ---------------- ADD BOOKING ----------------
  const addBooking = async () => {
    try {
      await API.post("/Bookings", {
        facilityId: parseInt(form.facilityId),
        userId: parseInt(form.userId),
        startDate: form.startDate,
        endDate: form.endDate,
        startTime: formatTime(form.startTime),
        endTime: formatTime(form.endTime),

        // Required backend fields
        totalPrice: 0,
        bookingStatus: "Pending",
        paymentMode: "Online",
        paymentStatus: "Unpaid"
      });

      refreshBookings();
      resetForm();
    } catch (err) {
      console.log("Add Booking Error:", err.response?.data || err);
      alert("Failed to add booking");
    }
  };

  // ---------------- START EDIT ----------------
  const startEdit = (b) => {
    setEditBookingId(b.bookingId);
    setForm({
      facilityId: b.facilityId,
      userId: b.userId,
      startDate: b.startDate.split("T")[0],
      endDate: b.endDate.split("T")[0],
      startTime: b.startTime.substring(0, 5),
      endTime: b.endTime.substring(0, 5)
    });
  };

  // ---------------- UPDATE BOOKING ----------------
  const updateBooking = async () => {
    try {
      await API.put(`/Bookings/${editBookingId}`, {
        facilityId: parseInt(form.facilityId),
        userId: parseInt(form.userId),
        startDate: form.startDate,
        endDate: form.endDate,
        startTime: formatTime(form.startTime),
        endTime: formatTime(form.endTime),

        totalPrice: 0,
        bookingStatus: "Pending",
        paymentMode: "Online",
        paymentStatus: "Unpaid"
      });

      refreshBookings();
      resetForm();
    } catch (err) {
      console.log("Update Booking Error:", err.response?.data || err);
      alert("Failed to update booking");
    }
  };

  // ---------------- DELETE BOOKING ----------------
  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    await API.delete(`/Bookings/${id}`);
    refreshBookings();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Bookings</h2>

      {/* FORM */}
      <h3>{editBookingId ? "Edit Booking" : "Add Booking"}</h3>
      <div style={{ marginBottom: 20, border: "1px solid #aaa", padding: 15 }}>
        <select name="facilityId" value={form.facilityId} onChange={handleChange}>
          <option value="">Select Facility</option>
          {facilities.map(f => (
            <option key={f.facilityId} value={f.facilityId}>{f.name}</option>
          ))}
        </select>

        <select name="userId" value={form.userId} onChange={handleChange}>
          <option value="">Select User</option>
          {users.map(u => (
            <option key={u.userId} value={u.userId}>{u.fullName}</option>
          ))}
        </select>

        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
        <input type="time" name="startTime" value={form.startTime} onChange={handleChange} />
        <input type="time" name="endTime" value={form.endTime} onChange={handleChange} />

        {editBookingId ? (
          <>
            <button onClick={updateBooking}>Update Booking</button>
            <button onClick={resetForm} style={{ marginLeft: 10 }}>Cancel</button>
          </>
        ) : (
          <button onClick={addBooking}>Add Booking</button>
        )}
      </div>

      {/* LIST */}
      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((b) => (
          <div key={b.bookingId} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}>
            <p><b>Booking ID:</b> {b.bookingId}</p>
            <p><b>User:</b> {b.user?.fullName}</p>
            <p><b>Facility:</b> {b.facility?.name}</p>
            <p><b>Start Date:</b> {new Date(b.startDate).toLocaleDateString()}</p>
            <p><b>End Date:</b> {new Date(b.endDate).toLocaleDateString()}</p>
            <p><b>Start Time:</b> {b.startTime}</p>
            <p><b>End Time:</b> {b.endTime}</p>
            <p><b>Total Price:</b> ₹{Number(b.totalPrice).toLocaleString("en-IN")}</p>
            <p><b>Status:</b> {b.bookingStatus}</p>
            <p><b>Payment Mode:</b> {b.paymentMode}</p>
            <p><b>Payment Status:</b> {b.paymentStatus}</p>
            <p><b>Created:</b> {new Date(b.createdAt).toLocaleString()}</p>

            <button onClick={() => startEdit(b)}>Edit</button>
            <button onClick={() => deleteBooking(b.bookingId)} style={{ marginLeft: 10 }}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}