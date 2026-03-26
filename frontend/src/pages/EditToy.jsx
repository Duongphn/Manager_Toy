import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload } from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function EditToy() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "", category: "", description: "", condition: "good",
    ageMin: "", ageMax: "", status: "available",
  });
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, toyRes] = await Promise.all([
          api.get("/categories"),
          api.get(`/toys/${id}`),
        ]);
        setCategories(catRes.data);
        const t = toyRes.data;
        setForm({
          name: t.name || "",
          category: t.category?._id || t.category || "",
          description: t.description || "",
          condition: t.condition || "good",
          ageMin: t.ageRange?.min?.toString() || "",
          ageMax: t.ageRange?.max?.toString() || "",
          status: t.status || "available",
        });
        setCurrentPhoto(t.photo || "");
      } catch (err) {
        setError("Failed to load toy");
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhotoChange = (e) => setPhotoFile(e.target.files?.[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("condition", form.condition);
      formData.append("status", form.status);
      if (form.ageMin && form.ageMax) {
        formData.append("ageMin", form.ageMin);
        formData.append("ageMax", form.ageMax);
      }
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      await api.put(`/toys/${id}`, formData);
      navigate("/my-toys");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update toy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Edit Toy</h1>
          <p className="page-sub">Update your toy details</p>
        </div>
      </div>

      <div className="form-card">
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Toy Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Condition *</label>
              <select name="condition" value={form.condition} onChange={handleChange}>
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Min Age</label>
              <input name="ageMin" type="number" min="0" max="18" value={form.ageMin} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Max Age</label>
              <input name="ageMax" type="number" min="0" max="18" value={form.ageMax} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows={4} value={form.description} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Photo</label>
            <div className="photo-input">
              <Upload size={18} />
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
            </div>
            {photoFile && <small>{photoFile.name}</small>}
            {!photoFile && currentPhoto && <small>Using current photo</small>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
