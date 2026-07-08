import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";

const ANNOUNCEMENT_CATEGORIES = [
  'pengumuman', 'ramadhan',
  'infaq', 'zakat', 'qurban', 'lainnya'
];

export default function Announcement() {
  const emptyForm = {
    title: "",
    content: "",
    category: "pengumuman",
    status: "draft"
  };

  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get("/announcements");
      setAnnouncements(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data pengumuman");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnnouncements();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/announcements/${editingId}`, form);
        alert("Pengumuman berhasil diperbarui");
      } else {
        await api.post("/announcements", form);
        alert("Pengumuman berhasil ditambahkan");
      }
      resetForm();
      getAnnouncements();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      content: item.content || "",
      category: item.category || "pengumuman",
      status: item.status || "draft"
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pengumuman?")) return;
    try {
      await api.delete(`/announcements/${id}`);
      alert("Pengumuman berhasil dihapus");
      getAnnouncements();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus pengumuman");
    }
  };

  return (
    <MainLayout>
      <div style={{ paddingBottom: '40px' }}>
        <h2 style={{ marginBottom: '24px' }}>Manajemen Pengumuman</h2>

        <div style={{ background: "#fff", padding: '24px', borderRadius: '12px', marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem' }}>{editingId ? "Edit Pengumuman" : "Buat Pengumuman"}</h3>
          
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: '20px' }}>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Judul Pengumuman</label>
              <input className="form-control" name="title" placeholder="Masukkan judul..." value={form.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Kategori</label>
              <select className="form-control" name="category" value={form.category} onChange={handleChange} required>
                {ANNOUNCEMENT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status Publikasi</label>
              <select className="form-control" name="status" value={form.status} onChange={handleChange} required>
                <option value="draft">Draft (Disembunyikan)</option>
                <option value="published">Published (Ditampilkan Publik)</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Isi Pengumuman</label>
              <textarea className="form-control" name="content" placeholder="Ketik isi pengumuman lengkap di sini..." value={form.content} onChange={handleChange} rows="5" required />
            </div>

            <div style={{ display: "flex", gap: '12px', gridColumn: '1 / -1', marginTop: '8px' }}>
              <button className="btn btn-primary" type="submit">
                {editingId ? "Update Pengumuman" : "Simpan Data"}
              </button>
              <button className="btn btn-secondary" type="button" onClick={resetForm}>
                Batal
              </button>
            </div>
          </form>
        </div>

        <div style={{ background: "#fff", padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem' }}>Daftar Pengumuman</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="table-modern">
              <thead>
                <tr>
                  <th width="50">No</th>
                  <th>Tanggal</th>
                  <th>Judul & Isi</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th width="160">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</td>
                  </tr>
                ) : announcements.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Tidak ada pengumuman</td>
                  </tr>
                ) : (
                  announcements.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID") : "-"}</td>
                      <td>
                        <strong style={{ display: 'block', marginBottom: '4px' }}>{item.title}</strong>
                        <div style={{ fontSize: '0.85em', color: '#666', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.content}
                        </div>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{item.category}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '0.85em', 
                          fontWeight: 500,
                          backgroundColor: item.status === 'published' ? '#e8f5e9' : '#eceff1',
                          color: item.status === 'published' ? '#2e7d32' : '#546e7a'
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', marginRight: '8px' }} onClick={() => handleEdit(item)}>Edit</button>
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => handleDelete(item._id)}>Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}