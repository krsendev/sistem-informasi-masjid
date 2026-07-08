import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";

const EVENT_CATEGORIES = [
  'kajian', 'sholat', 'pengajian', 'ramadhan',
  'musyawarah', 'sosial', 'pendidikan', 'lainnya'
];

export default function Events() {
  const emptyForm = {
    title: "",
    description: "",
    ustadz: "",
    category: "kajian",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    isPublished: false,
  };

  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events");
      setEvents(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/events/${editingId}`, form);
        alert("Event berhasil diupdate");
      } else {
        await api.post("/events", form);
        alert("Event berhasil ditambahkan");
      }
      resetForm();
      getEvents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const editEvent = (event) => {
    setEditingId(event._id);
    setForm({
      title: event.title || "",
      description: event.description || "",
      ustadz: event.ustadz || "",
      category: event.category || "kajian",
      location: event.location || "",
      date: event.date ? event.date.substring(0, 10) : "",
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      isPublished: event.isPublished || false,
    });
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Yakin ingin menghapus event?")) return;
    try {
      await api.delete(`/events/${id}`);
      alert("Event berhasil dihapus");
      getEvents();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus event");
    }
  };

  return (
    <MainLayout>
      <div style={{ paddingBottom: '40px' }}>
        <h2 style={{ marginBottom: '24px' }}>Manajemen Kegiatan & Kajian</h2>

        <div style={{ background: "#fff", padding: '24px', borderRadius: '12px', marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem' }}>{editingId ? "Edit Event" : "Tambah Event"}</h3>
          
          <form onSubmit={saveEvent} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: '20px' }}>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Judul Event/Kajian</label>
              <input className="form-control" name="title" placeholder="Cth: Kajian Rutin Ba'da Maghrib" value={form.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Kategori</label>
              <select className="form-control" name="category" value={form.category} onChange={handleChange} required>
                {EVENT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Narasumber / Ustadz (Opsional)</label>
              <input className="form-control" name="ustadz" placeholder="Cth: Ustadz Fulan" value={form.ustadz} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Lokasi</label>
              <input className="form-control" name="location" placeholder="Ruang Utama Masjid" value={form.location} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Tanggal</label>
              <input className="form-control" type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Waktu Mulai</label>
              <input className="form-control" type="time" name="startTime" value={form.startTime} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Waktu Selesai</label>
              <input className="form-control" type="time" name="endTime" value={form.endTime} onChange={handleChange} required />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Deskripsi Singkat</label>
              <textarea className="form-control" name="description" placeholder="Informasi tambahan..." value={form.description} onChange={handleChange} rows="3" required />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1', flexDirection: 'row', alignItems: 'center' }}>
              <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} style={{ transform: 'scale(1.2)' }} />
              <label style={{ marginLeft: '8px', cursor: 'pointer' }} onClick={() => setForm({...form, isPublished: !form.isPublished})}>
                Tampilkan di halaman publik (Publish)
              </label>
            </div>

            <div style={{ display: "flex", gap: '12px', gridColumn: '1 / -1', marginTop: '8px' }}>
              <button className="btn btn-primary" type="submit">
                {editingId ? "Update Event" : "Simpan Data"}
              </button>
              <button className="btn btn-secondary" type="button" onClick={resetForm}>
                Batal
              </button>
            </div>
          </form>
        </div>

        <div style={{ background: "#fff", padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem' }}>Daftar Event</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="table-modern">
              <thead>
                <tr>
                  <th width="50">No</th>
                  <th>Tanggal</th>
                  <th>Waktu</th>
                  <th>Judul Kegiatan</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th width="160">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Tidak ada data event</td>
                  </tr>
                ) : (
                  events.map((event, index) => (
                    <tr key={event._id}>
                      <td>{index + 1}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{event.date ? new Date(event.date).toLocaleDateString("id-ID") : "-"}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{event.startTime} - {event.endTime}</td>
                      <td>
                        <strong style={{ display: 'block' }}>{event.title}</strong>
                        {event.ustadz && <span style={{ fontSize: '0.85em', color: '#666' }}>🎤 {event.ustadz}</span>}
                        <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>📍 {event.location}</div>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{event.category}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '0.85em', 
                          fontWeight: 500,
                          backgroundColor: event.isPublished ? '#e8f5e9' : '#fff3e0',
                          color: event.isPublished ? '#2e7d32' : '#e65100'
                        }}>
                          {event.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', marginRight: '8px' }} onClick={() => editEvent(event)}>Edit</button>
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => deleteEvent(event._id)}>Hapus</button>
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