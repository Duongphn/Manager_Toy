import { Package, Star } from "lucide-react";

const conditionLabels = {
  new: "New",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
};

const statusColors = {
  available: { bg: "#F0FDF4", text: "#22C55E" },
  borrowed: { bg: "#FFF0F0", text: "#FF6B6B" },
  unavailable: { bg: "#F6F7F8", text: "#6B7280" },
};

export default function ToyCard({ toy, actions }) {
  const statusStyle = statusColors[toy.status] || statusColors.available;
  const hasReviews = Number(toy.reviewCount) > 0;

  return (
    <div className="toy-card">
      <div className="toy-card-img">
        {toy.photo ? (
          <img src={toy.photo} alt={toy.name} />
        ) : (
          <Package size={48} color="#9CA3AF" />
        )}
      </div>
      <div className="toy-card-body">
        <h3>{toy.name}</h3>
        <p>{toy.description || "No description"}</p>
        <div className="toy-card-rating" aria-label="Toy rating">
          <Star size={14} className="toy-rating-star" />
          {hasReviews ? (
            <>
              <strong>{Number(toy.avgRating).toFixed(1)}</strong>
              <span>({toy.reviewCount} reviews)</span>
            </>
          ) : (
            <span>No reviews yet</span>
          )}
        </div>
      </div>
      <div className="toy-card-meta">
        <span
          className="status-badge"
          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
        >
          {toy.status}
        </span>
        <span className="toy-card-age">
          Age: {toy.ageRange?.min || 0}-{toy.ageRange?.max || 12}
        </span>
      </div>
      {actions && <div className="toy-card-actions">{actions}</div>}
    </div>
  );
}
