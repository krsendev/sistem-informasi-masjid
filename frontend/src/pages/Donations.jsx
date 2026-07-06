import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";

export default function Donations() {
  const emptyForm = {
    donorName: "",
    amount: "",
    method: "Cash",
    description: "",
  };

  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getDonations = async () => {
    try {
      setLoading(true);

      const res = await api.get("/donations");

      setDonations(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data donasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDonations();
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
        await api.put(`/donations/${editingId}`, form);
        alert("Donasi berhasil diperbarui");
      } else {
        await api.post("/donations", form);
        alert("Donasi berhasil ditambahkan");
      }

      resetForm();
      getDonations();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    setForm({
      donorName: item.donorName || "",
      amount: item.amount || "",
      method: item.method || "Cash",
      description: item.description || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus donasi?")) return;

    try {
      await api.delete(`/donations/${id}`);
      alert("Donasi berhasil dihapus");
      getDonations();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus donasi");
    }
  };

  return (
    <MainLayout>
      <h2>Manajemen Donasi</h2>

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
          name="donorName"
          placeholder="Nama Donatur"
          value={form.donorName}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Nominal"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <select
          name="method"
          value={form.method}
          onChange={handleChange}
        >
          <option value="Cash">Cash</option>
          <option value="Transfer">Transfer</option>
          <option value="QRIS">QRIS</option>
        </select>

        <textarea
          name="description"
          placeholder="Keterangan"
          rows="4"
          value={form.description}
          onChange={handleChange}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">
            {editingId ? "Update Donasi" : "Tambah Donasi"}
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
            <th>Donatur</th>
            <th>Nominal</th>
            <th>Metode</th>
            <th>Keterangan</th>
            <th width="170">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">Memuat data...</td>
            </tr>
          ) : donations.length === 0 ? (
            <tr>
              <td colSpan="6">Tidak ada data</td>
            </tr>
          ) : (
            donations.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.donorName}</td>
                <td>
                  Rp {Number(item.amount).toLocaleString("id-ID")}
                </td>
                <td>{item.method}</td>
                <td>{item.description}</td>

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