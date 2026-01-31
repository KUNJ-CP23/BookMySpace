import { useEffect, useState } from "react";
import API from "../services/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    API.get("/Reviews")
      .then((res) => setReviews(res.data))
      .catch((err) => console.log("Reviews Error:", err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold">Reviews</h2>
      <p className="text-zinc-400 mt-1">GetAll reviews</p>

      <div className="mt-5 space-y-3">
        {reviews.length === 0 ? (
          <p>No reviews found</p>
        ) : (
          reviews.map((rv) => (
            <div
              key={rv.reviewId}
              className="border border-zinc-800 rounded-xl p-4"
            >
              <p><b>ReviewId:</b> {rv.reviewId}</p>
              <p><b>UserId:</b> {rv.userId}</p>
              <p><b>FacilityId:</b> {rv.facilityId}</p>
              <p><b>Rating:</b> {rv.rating}</p>
              <p><b>Comment:</b> {rv.comment || rv.reviewText}</p>
              <p><b>CreatedAt:</b> {String(rv.createdAt)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}