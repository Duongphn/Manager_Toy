import { useEffect, useState } from "react";
import { Search, Filter, Package } from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";
import ToyCard from "../components/ToyCard";

export default function BrowseToys() {
  const [toys, setToys] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(null);

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchToys();
  }, [search, category]);

  const fetchToys = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const res = await api.get("/toys", { params });
      setToys(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (toyId) => {
    if (!window.confirm("Would you like to borrow this toy for 7 days?")) return;
    setBorrowing(toyId);
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      await api.post("/borrows", { toyId, dueDate: dueDate.toISOString() });
      fetchToys();
    } catch (err) {
      alert(err.response?.data?.message || "Borrow failed");
    } finally {
      setBorrowing(null);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Browse Toys</h1>
          <p className="page-sub">Discover toys available for borrowing</p>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search toys..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={16} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><p>Loading...</p></div>
      ) : toys.length === 0 ? (
        <div className="empty-state">
          <Package size={48} color="#D1D5DB" />
          <h3>No toys found</h3>
          <p>Try changing your search or filter criteria.</p>
        </div>
      ) : (
        <div className="toy-grid">
          {toys.map((toy) => (
            <ToyCard
              key={toy._id}
              toy={toy}
              actions={
                toy.status === "available" ? (
                  <button
                    className="btn-primary full"
                    onClick={() => handleBorrow(toy._id)}
                    disabled={borrowing === toy._id}
                  >
                    {borrowing === toy._id ? "Borrowing..." : "Borrow"}
                  </button>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </Layout>
  );
}
