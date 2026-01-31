import { useEffect, useState } from "react";
import API from "../services/api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/Bookings")
      .then((res) => setBookings(res.data))
      .catch((err) => console.log("Bookings Error:", err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.bookingId}
            style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
          >
            <p><b>BookingId:</b> {b.bookingId}</p>
            <p><b>UserId:</b> {b.userId}</p>
            <p><b>FacilityId:</b> {b.facilityId}</p>

            <p><b>Start:</b> {String(b.startDate)} {String(b.startTime)}</p>
            <p><b>End:</b> {String(b.endDate)} {String(b.endTime)}</p>

            <p><b>TotalPrice:</b> {b.totalPrice}</p>
            <p><b>Status:</b> {b.bookingStatus}</p>

            {/* Option 2 fields */}
            {b.paymentMode && <p><b>PaymentMode:</b> {b.paymentMode}</p>}
            {b.paymentStatus && <p><b>PaymentStatus:</b> {b.paymentStatus}</p>}
          </div>
        ))
      )}
    </div>
  );
}