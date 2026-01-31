// export default function Payment() {
//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Payments Page</h2>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import API from "../services/api";

export default function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    API.get("/Payments")
      .then((res) => setPayments(res.data))
      .catch((err) => console.log("Payments Error:", err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Payments</h2>

      {payments.length === 0 ? (
        <p>No payments found</p>
      ) : (
        payments.map((p) => (
          <div
            key={p.paymentId}
            style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
          >
            <p><b>PaymentId:</b> {p.paymentId}</p>
            <p><b>BookingId:</b> {p.bookingId}</p>
            <p><b>UserId:</b> {p.userId}</p>

            <p><b>Amount:</b> {p.amount}</p>
            <p><b>Method:</b> {p.paymentMethod}</p>
            <p><b>Status:</b> {p.paymentStatus}</p>
            <p><b>TransactionId:</b> {p.transactionId}</p>

            <p><b>PaidAt:</b> {String(p.paidAt)}</p>
          </div>
        ))
      )}
    </div>
  );
}