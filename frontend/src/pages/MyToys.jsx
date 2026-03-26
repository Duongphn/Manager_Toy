import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Package, Filter } from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function MyToys() {
  const [toys, setToys] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchToys();
  }, []);

  const fetchToys = async () => {
    try {
      const res = await api.get("/toys/mine");
      setToys(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this toy?")) return;
    try {
      await api.delete(`/toys/${id}`);
      setToys(toys.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const filtered = toys.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const conditionLabel = { new: "New", like_new: "Like New", good: "Good", fair: "Fair" };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>My Toys</h1>
          <p className="page-sub">Manage your shared toys</p>
        </div>
        <Link to="/toys/add" className="btn-primary">
          <Plus size={18} /> Add Toy
        </Link>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search toys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={16} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Package size={48} color="#D1D5DB" />
          <h3>No toys found</h3>
          <p>{toys.length === 0 ? "Start by adding your first toy!" : "Try changing your search or filter."}</p>
          {toys.length === 0 && (
            <Link to="/toys/add" className="btn-primary">
              <Plus size={18} /> Add Your First Toy
            </Link>
          )}
        </div>
      ) : (
        <div className="toy-table-wrap">
          <table className="toy-table">
            <thead>
              <tr>
                <th>Toy</th>
                <th>Category</th>
                <th>Condition</th>
                <th>Status</th>
                <th>Age Range</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((toy) => (
                <tr key={toy._id}>
                  <td className="toy-name-cell">
                    <div className="toy-thumb">
                      {toy.photo ? <img src={toy.photo} alt={toy.name} /> : <Package size={18} color="#9CA3AF" />}
                    </div>
                    <span>{toy.name}</span>
                  </td>
                  <td>{toy.category?.name || "—"}</td>
                  <td>{conditionLabel[toy.condition] || toy.condition}</td>
                  <td><span className={`status-badge ${toy.status}`}>{toy.status}</span></td>
                  <td>{toy.ageRange ? `${toy.ageRange.min}–${toy.ageRange.max} yrs` : "—"}</td>
                  <td className="actions-cell">
                    <button className="icon-btn edit" onClick={() => navigate(`/toys/edit/${toy._id}`)}>
                      <Pencil size={16} />
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDelete(toy._id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
