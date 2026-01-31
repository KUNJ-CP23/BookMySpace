// export default function Facilities() {
//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Facilities Page</h2>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import API from "../services/api";

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    API.get("/Facilities")
      .then((res) => setFacilities(res.data))
      .catch((err) => console.log("Facilities Error:", err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Facilities</h2>

      {facilities.length === 0 ? (
        <p>No facilities found</p>
      ) : (
        facilities.map((f) => (
          <div
            key={f.facilityId}
            style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
          >
            <p><b>Name:</b> {f.name}</p>
            <p><b>City:</b> {f.city}</p>
            <p><b>Price/Hour:</b> {f.pricePerHour}</p>
            <p><b>Gov Owned:</b> {String(f.isGovOwned)}</p>
          </div>
        ))
      )}
    </div>
  );
}