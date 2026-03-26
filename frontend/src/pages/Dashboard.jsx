import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRightLeft, CheckCircle, Clock, TrendingUp, Calendar, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalToys: 0, activeBorrows: 0, totalBorrows: 0, availableToys: 0 });
  const [recentToys, setRecentToys] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, toysRes] = await Promise.all([
          api.get("/borrows/stats"),
          api.get("/toys/mine"),
        ]);
        setStats(statsRes.data);
        setRecentToys(toysRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const cards = [
    { label: "Total Toys", value: stats.totalToys, icon: Package, color: "#FF6B6B", bg: "#FFF0F0" },
    { label: "Active Borrows", value: stats.activeBorrows, icon: ArrowRightLeft, color: "#6366F1", bg: "#EEF2FF" },
    { label: "Completed", value: stats.totalBorrows, icon: CheckCircle, color: "#22C55E", bg: "#F0FDF4" },
    { label: "Available", value: stats.availableToys, icon: Clock, color: "#F59E0B", bg: "#FFFBEB" },
  ];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.firstName}!</h1>
          <p className="page-sub">Here's what's happening with your toy sharing</p>
        </div>
        <Link to="/toys/add" className="btn-primary">
          <Plus size={18} /> Add Toy
        </Link>
      </div>

      <div className="stats-cards">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon" style={{ backgroundColor: bg }}>
              <Icon size={22} color={color} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
            <TrendingUp size={16} className="stat-trend" />
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="dash-section">
          <div className="dash-section-header">
            <h2>Recent Toys</h2>
            <Link to="/my-toys" className="link-sm">View All</Link>
          </div>
          {recentToys.length === 0 ? (
            <p className="empty-text">No toys yet. Add your first toy!</p>
          ) : (
            <div className="recent-list">
              {recentToys.map((toy) => (
                <div className="recent-item" key={toy._id}>
                  <div className="recent-thumb">
                    {toy.photo ? (
                      <img src={toy.photo} alt={toy.name} />
                    ) : (
                      <Package size={20} color="#9CA3AF" />
                    )}
                  </div>
                  <div className="recent-info">
                    <strong>{toy.name}</strong>
                    <span>{toy.condition?.replace("_", " ")}</span>
                  </div>
                  <span className={`status-badge ${toy.status}`}>{toy.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dash-section">
          <div className="dash-section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Link to="/toys/add" className="quick-action-card">
              <Plus size={20} color="#FF6B6B" />
              <span>Add New Toy</span>
            </Link>
            <Link to="/browse" className="quick-action-card">
              <Package size={20} color="#6366F1" />
              <span>Browse Toys</span>
            </Link>
            <Link to="/borrows" className="quick-action-card">
              <Calendar size={20} color="#22C55E" />
              <span>My Borrows</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
