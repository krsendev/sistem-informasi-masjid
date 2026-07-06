import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";

export default function Announcement() {
  const emptyForm = {
    title: "",
    content: "",
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
      <h2>Manajemen Pengumuman</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: 10,
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          marginBottom: 25,
        }}
      >
        <input
          name="title"
          placeholder="Judul Pengumuman"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="content"
          placeholder="Isi Pengumuman"
          value={form.content}
          onChange={handleChange}
          rows="5"
          required
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">
            {editingId ? "Update Pengumuman" : "Tambah Pengumuman"}
          </button>

          <button type="button" onClick={resetForm}>
            Reset
          </button>
        </div>
      </form>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>No</th>
            <th>Judul</th>
            <th>Isi</th>
            <th width="170">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4">Memuat data...</td>
            </tr>
          ) : announcements.length === 0 ? (
            <tr>
              <td colSpan="4">Tidak ada data</td>
            </tr>
          ) : (
            announcements.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.title}</td>
                <td>{item.content}</td>

                <td>
                  <button onClick={() => handleEdit(item)}>
                    Edit
                  </button>

                  <button
                    style={{ marginLeft: 10 }}
                    onClick={() => handleDelete(item._id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </MainLayout>
  );
}