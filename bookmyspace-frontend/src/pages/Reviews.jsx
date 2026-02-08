import { useEffect, useState } from "react";
import API from "../services/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [facilities, setFacilities] = useState([]);

  const [form, setForm] = useState({
    facilityId: "",
    userId: "",
    rating: "",
    comment: ""
  });

  const [editReviewId, setEditReviewId] = useState(null);

  useEffect(() => {
    API.get("/Reviews").then(res => setReviews(res.data));
    API.get("/Bookings").then(res => setBookings(res.data));
    API.get("/Users").then(res => setUsers(res.data));
    API.get("/Facilities").then(res => setFacilities(res.data));
  }, []);

  const refreshReviews = async () => {
    const res = await API.get("/Reviews");
    setReviews(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      facilityId: "",
      userId: "",
      rating: "",
      comment: ""
    });
    setEditReviewId(null);
  };

  // add review function
  const addReview = async () => {
    try {
      await API.post("/Reviews", {
        facilityId: parseInt(form.facilityId),
        userId: parseInt(form.userId),
        rating: parseInt(form.rating),
        comment: form.comment
      });

      refreshReviews();
      resetForm();
    } catch (err) {
      console.log("Add Review Error:", err.response?.data || err);
      alert("Failed to add review");
    }
  };

  // start edit function - populate form with existing review data
  const startEdit = (rv) => {
    setEditReviewId(rv.reviewId);
    setForm({
      facilityId: rv.facilityId,
      userId: rv.userId,
      rating: rv.rating,
      comment: rv.comment || ""
    });
  };

  // update review function
  const updateReview = async () => {
    try {
      await API.put(`/Reviews/${editReviewId}`, {
        facilityId: parseInt(form.facilityId),
        userId: parseInt(form.userId),
        rating: parseInt(form.rating),
        comment: form.comment
      });

      refreshReviews();
      resetForm();
    } catch (err) {
      console.log("Update Review Error:", err.response?.data || err);
      alert("Failed to update review");
    }
  };

  //delete review function
  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    await API.delete(`/Reviews/${id}`);
    refreshReviews();
  };

  // Get bookings for selected user
  const userBookings = bookings.filter(b => b.userId == form.userId);

  // Unique facilities booked by that user
  const facilityIdsForUser = [...new Set(userBookings.map(b => b.facilityId))];

  // Final facility list allowed for review
  const filteredFacilities = facilities.filter(f =>
    facilityIdsForUser.includes(f.facilityId)
  );

  // Users who have at least one booking
  const bookedUserIds = [...new Set(bookings.map(b => b.userId))];
  const usersWhoBooked = users.filter(u => bookedUserIds.includes(u.userId));

  return (
    <div style={{ padding: 20 }}>
      <h2>Reviews</h2>

      <h3>{editReviewId ? "Edit Review" : "Add Review"}</h3>
      <div style={{ marginBottom: 20, border: "1px solid #aaa", padding: 15 }}>
        <select name="userId" value={form.userId} onChange={(e) => {
  handleChange(e);
          setForm(prev => ({ ...prev, facilityId: "" })); // reset facility when user changes
        }}>
          <option value="">Select User</option>
          {usersWhoBooked.map(u => (
            <option key={u.userId} value={u.userId}>{u.fullName}</option>
          ))}
        </select>
        <select
          name="facilityId"
          value={form.facilityId}
          onChange={handleChange}
          disabled={!form.userId}
        >
          <option value="">Select Facility</option>
          {filteredFacilities.map(f => (
            <option key={f.facilityId} value={f.facilityId}>{f.name}</option>
          ))}
        </select>


        <input
          type="number"
          name="rating"
          placeholder="Rating (1-5)"
          min="1"
          max="5"
          value={form.rating}
          onChange={handleChange}
        />

        <textarea
          name="comment"
          placeholder="Comment"
          value={form.comment}
          onChange={handleChange}
        />

        {editReviewId ? (
          <>
            <button onClick={updateReview}>Update Review</button>
            <button onClick={resetForm} style={{ marginLeft: 10 }}>Cancel</button>
          </>
        ) : (
          <button onClick={addReview}>Add Review</button>
        )}
      </div>

      {reviews.length === 0 ? (
        <p>No reviews found</p>
      ) : (
        reviews.map((rv) => (
          <div key={rv.reviewId} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}>
            <p><b>Review ID:</b> {rv.reviewId}</p>
            <p><b>User:</b> {rv.user?.fullName}</p>
            <p><b>Facility:</b> {rv.facility?.name}</p>
            <p><b>Rating:</b> ⭐ {rv.rating}</p>
            <p><b>Comment:</b> {rv.comment}</p>
            <p><b>Created:</b> {new Date(rv.createdAt).toLocaleString()}</p>

            <button onClick={() => startEdit(rv)}>Edit</button>
            <button onClick={() => deleteReview(rv.reviewId)} style={{ marginLeft: 10 }}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}