import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";

export default function Events() {
  const emptyForm = {
    title: "",
    description: "",
    location: "",
    date: "",
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
      console.log(err);
      alert("Gagal mengambil data event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
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
      console.log(err);
      alert(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const editEvent = (event) => {
    setEditingId(event._id);

    setForm({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      date: event.date
        ? event.date.substring(0, 10)
        : "",
    });
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Yakin ingin menghapus event?")) return;

    try {
      await api.delete(`/events/${id}`);

      alert("Event berhasil dihapus");

      getEvents();
    } catch (err) {
      console.log(err);
      alert("Gagal menghapus event");
    }
  };

  return (
    <MainLayout>
      <h2>Manajemen Event</h2>

      <form
        onSubmit={saveEvent}
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
          placeholder="Judul Event"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Deskripsi"
          value={form.description}
          onChange={handleChange}
          rows="4"
        />

        <input
          name="location"
          placeholder="Lokasi"
          value={form.location}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">
            {editingId ? "Update Event" : "Tambah Event"}
          </button>

          <button
            type="button"
            onClick={resetForm}
          >
            Reset
          </button>
        </div>
      </form>

      <table
        border="1"
        cellPadding="10"
        width="100%"
      >
        <thead>
          <tr>
            <th>No</th>
            <th>Judul</th>
            <th>Lokasi</th>
            <th>Tanggal</th>
            <th width="180">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5">
                Memuat...
              </td>
            </tr>
          ) : events.length === 0 ? (
            <tr>
              <td colSpan="5">
                Tidak ada data
              </td>
            </tr>
          ) : (
            events.map((event, index) => (
              <tr key={event._id}>
                <td>{index + 1}</td>
                <td>{event.title}</td>
                <td>{event.location}</td>
                <td>
                  {event.date
                    ? new Date(event.date).toLocaleDateString("id-ID")
                    : "-"}
                </td>

                <td>
                  <button
                    onClick={() => editEvent(event)}
                  >
                    Edit
                  </button>

                  <button
                    style={{ marginLeft: 10 }}
                    onClick={() => deleteEvent(event._id)}
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