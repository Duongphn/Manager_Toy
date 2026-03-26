import { useEffect, useState } from "react";
import { Package, Calendar, RotateCcw, Clock, Star, ArrowRightLeft } from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function MyBorrows() {
  const [borrows, setBorrows] = useState([]);
  const [tab, setTab] = useState("active");
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const res = await api.get("/borrows/mine");
      setBorrows(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm("Mark this toy as returned?")) return;
    try {
      await api.put(`/borrows/${id}/return`);
      fetchBorrows();
    } catch (err) {
      alert(err.response?.data?.message || "Return failed");
    }
  };

  const handleExtend = async (id) => {
    if (!window.confirm("Extend borrowing period by 7 days?")) return;
    try {
      await api.put(`/borrows/${id}/extend`);
      fetchBorrows();
    } catch (err) {
      alert(err.response?.data?.message || "Extend failed");
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reviews", {
        borrowId: reviewModal._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviewModal(null);
      setReviewForm({ rating: 5, comment: "" });
      alert("Review submitted!");
    } catch (err) {
      alert(err.response?.data?.message || "Review failed");
    }
  };

  const filtered = borrows.filter((b) => {
    if (tab === "active") return b.status === "active" || b.status === "extended";
    if (tab === "returned") return b.status === "returned";
    if (tab === "overdue") return b.status === "overdue";
    return true;
  });

  const statusIcon = {
    active: <ArrowRightLeft size={16} />,
    extended: <Clock size={16} />,
    returned: <RotateCcw size={16} />,
    overdue: <Clock size={16} />,
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : "—";

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>My Borrows</h1>
          <p className="page-sub">Track your borrowed toys</p>
        </div>
      </div>

      <div className="tabs">
        {["active", "returned", "overdue"].map((t) => (
          <button
            key={t}
            className={`tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            <span className="tab-count">
              {borrows.filter((b) =>
                t === "active" ? (b.status === "active" || b.status === "extended") :
                b.status === t
              ).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Package size={48} color="#D1D5DB" />
          <h3>No {tab} borrows</h3>
          <p>Your {tab} borrows will appear here.</p>
        </div>
      ) : (
        <div className="borrow-list">
          {filtered.map((b) => (
            <div className="borrow-card" key={b._id}>
              <div className="borrow-thumb">
                {b.toy?.photo ? (
                  <img src={b.toy.photo} alt={b.toy.name} />
                ) : (
                  <Package size={24} color="#9CA3AF" />
                )}
              </div>
              <div className="borrow-info">
                <h3>{b.toy?.name || "Toy"}</h3>
                <p className="borrow-owner">
                  From: {b.owner?.firstName} {b.owner?.lastName}
                </p>
                <div className="borrow-dates">
                  <span><Calendar size={14} /> Borrowed: {formatDate(b.borrowDate)}</span>
                  <span><Clock size={14} /> Due: {formatDate(b.dueDate)}</span>
                </div>
              </div>
              <div className="borrow-actions">
                <span className={`status-badge ${b.status}`}>
                  {statusIcon[b.status]} {b.status}
                </span>
                {(b.status === "active" || b.status === "extended") && (
                  <div className="borrow-btns">
                    <button className="btn-sm green" onClick={() => handleReturn(b._id)}>Return</button>
                    {b.extendCount < 2 && (
                      <button className="btn-sm outline" onClick={() => handleExtend(b._id)}>Extend</button>
                    )}
                  </div>
                )}
                {b.status === "returned" && (
                  <button className="btn-sm indigo" onClick={() => setReviewModal(b)}>
                    <Star size={14} /> Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="modal-overlay" onClick={() => setReviewModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Leave a Review</h3>
            <p>Rate your experience with {reviewModal.toy?.name}</p>
            <form onSubmit={handleReview}>
              <div className="form-group">
                <label>Rating</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`star-btn ${s <= reviewForm.rating ? "active" : ""}`}
                      onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                    >
                      <Star size={24} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  rows={3}
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setReviewModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
