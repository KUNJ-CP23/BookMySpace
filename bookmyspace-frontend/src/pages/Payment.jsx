import { useEffect, useState } from "react";
import API from "../services/api";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [form, setForm] = useState({
    bookingId: "",
    userId: "",
    amount: "",
    paymentMethod: "",
    transactionId: "",
    remarks: ""
  });

  const [editPaymentId, setEditPaymentId] = useState(null);

  // ===== LOAD DATA =====
  useEffect(() => {
    API.get("/Payments")
      .then(res => setPayments(res.data))
      .catch(err => console.log("Payments Error:", err));

    API.get("/Bookings")
      .then(res => setBookings(res.data))
      .catch(err => console.log("Bookings Error:", err));
  }, []);

  const refreshPayments = async () => {
    const res = await API.get("/Payments");
    setPayments(res.data);
  };

  // ===== HANDLE INPUT =====
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ AUTO USER + AMOUNT FROM BOOKING
  const handleBookingChange = (e) => {
    const bookingId = e.target.value;

    const selectedBooking = bookings.find(
      b => b.bookingId === parseInt(bookingId)
    );

    setForm(prev => ({
      ...prev,
      bookingId: bookingId,
      userId: selectedBooking?.userId || "",
      amount: selectedBooking?.totalPrice || ""
    }));
  };

  const resetForm = () => {
    setForm({
      bookingId: "",
      userId: "",
      amount: "",
      paymentMethod: "",
      transactionId: "",
      remarks: ""
    });
    setEditPaymentId(null);
  };

  // ===== ADD =====
  const addPayment = async () => {
    try {
      await API.post("/Payments", {
        bookingId: parseInt(form.bookingId),
        userId: parseInt(form.userId),
        amount: parseFloat(form.amount),
        paymentMethod: form.paymentMethod,
        transactionId: form.transactionId,
        remarks: form.remarks
      });

      refreshPayments();
      resetForm();

    } catch (err) {
      console.log("FULL ERROR:", err.response?.data);
      alert(JSON.stringify(err.response?.data, null, 2));
    }
  };

  // ===== EDIT START =====
  const startEdit = (p) => {
    setEditPaymentId(p.paymentId);

    setForm({
      bookingId: p.bookingId,
      userId: p.userId,
      amount: p.amount,
      paymentMethod: p.paymentMethod,
      transactionId: p.transactionId || "",
      remarks: p.remarks || ""
    });
  };

  // ===== UPDATE =====
  const updatePayment = async () => {
    try {
      await API.put(`/Payments/${editPaymentId}`, {
        bookingId: parseInt(form.bookingId),
        userId: parseInt(form.userId),
        amount: parseFloat(form.amount),
        paymentMethod: form.paymentMethod,
        transactionId: form.transactionId || "TXN" + Date.now(),
        remarks: form.remarks
      });

      refreshPayments();
      resetForm();

    } catch (err) {
      console.log("Update Error:", err.response?.data || err);
      alert("Update failed");
    }
  };

  // ===== DELETE =====
  const deletePayment = async (id) => {
    if (!window.confirm("Delete this payment?")) return;

    await API.delete(`/Payments/${id}`);
    refreshPayments();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Payments</h2>

      {/* ===== FORM ===== */}
      <h3>{editPaymentId ? "Edit Payment" : "Add Payment"}</h3>

      <div style={{ border: "1px solid #aaa", padding: 15, marginBottom: 20 }}>

        {/* ✅ PRIVATE BOOKINGS ONLY */}
        <select value={form.bookingId} onChange={handleBookingChange}>
          <option value="">Select Booking</option>

          {bookings
            .filter(b => !b.facility?.isGovOwned)
            .map(b => (
              <option key={b.bookingId} value={b.bookingId}>
                #{b.bookingId} | {b.user?.fullName} | {b.facility?.name}
              </option>
            ))
          }
        </select>

        <br /><br />

        <input
          value={form.userId}
          placeholder="User ID (auto)"
          disabled
          style={{ background: "#d23f3f" }}
        />

        <br /><br />

        <input
          value={form.amount}
          placeholder="Amount (auto)"
          disabled
          style={{ background: "#e82626" }}
        />

        <br /><br />

        <input
          name="paymentMethod"
          placeholder="Payment Method (UPI/Card/NetBanking)"
          value={form.paymentMethod}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="transactionId"
          placeholder="Transaction ID (auto if empty)"
          value={form.transactionId}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="remarks"
          placeholder="Remarks"
          value={form.remarks}
          onChange={handleChange}
        />

        <br /><br />

        {editPaymentId ? (
          <>
            <button onClick={updatePayment}>Update</button>
            <button onClick={resetForm} style={{ marginLeft: 10 }}>
              Cancel
            </button>
          </>
        ) : (
          <button onClick={addPayment}>Add Payment</button>
        )}
      </div>

      {/* ===== LIST ===== */}
      {payments.length === 0 ? (
        <p>No payments found</p>
      ) : (
        payments.map((p) => (
          <div
            key={p.paymentId}
            style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}
          >
            <p><b>ID:</b> {p.paymentId}</p>
            <p><b>User:</b> {p.user?.fullName}</p>
            <p><b>Facility:</b> {p.booking?.facility?.name}</p>
            <p><b>Amount:</b> ₹{Number(p.amount).toLocaleString("en-IN")}</p>
            <p><b>Method:</b> {p.paymentMethod}</p>
            <p><b>Status:</b> {p.paymentStatus}</p>
            <p><b>Txn:</b> {p.transactionId}</p>

            <button onClick={() => startEdit(p)}>Edit</button>
            <button
              onClick={() => deletePayment(p.paymentId)}
              style={{ marginLeft: 10 }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}