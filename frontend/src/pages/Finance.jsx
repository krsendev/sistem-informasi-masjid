import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";

export default function Finance() {
  const emptyForm = {
    title: "",
    type: "Pemasukan",
    amount: "",
    description: "",
    date: "",
  };

  const [finances, setFinances] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getFinances = async () => {
    try {
      setLoading(true);

      const res = await api.get("/finances");

      setFinances(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data keuangan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFinances();
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
        await api.put(`/finances/${editingId}`, form);
        alert("Data berhasil diperbarui");
      } else {
        await api.post("/finances", form);
        alert("Data berhasil ditambahkan");
      }

      resetForm();
      getFinances();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    setForm({
      title: item.title || "",
      type: item.type || "Pemasukan",
      amount: item.amount || "",
      description: item.description || "",
      date: item.date ? item.date.substring(0, 10) : "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data?")) return;

    try {
      await api.delete(`/finances/${id}`);

      alert("Data berhasil dihapus");

      getFinances();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data");
    }
  };

  const totalPemasukan = finances
    .filter((item) => item.type === "Pemasukan")
    .reduce((total, item) => total + Number(item.amount), 0);

  const totalPengeluaran = finances
    .filter((item) => item.type === "Pengeluaran")
    .reduce((total, item) => total + Number(item.amount), 0);

  const saldo = totalPemasukan - totalPengeluaran;

  return (
    <MainLayout>
      <h2>Manajemen Keuangan</h2>

      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 25,
        }}
      >
        <div
          style={{
            background: "#4CAF50",
            color: "white",
            padding: 20,
            borderRadius: 10,
            flex: 1,
          }}
        >
          <h3>Total Pemasukan</h3>
          <h2>
            Rp {totalPemasukan.toLocaleString("id-ID")}
          </h2>
        </div>

        <div
          style={{
            background: "#F44336",
            color: "white",
            padding: 20,
            borderRadius: 10,
            flex: 1,
          }}
        >
          <h3>Total Pengeluaran</h3>
          <h2>
            Rp {totalPengeluaran.toLocaleString("id-ID")}
          </h2>
        </div>

        <div
          style={{
            background: "#2196F3",
            color: "white",
            padding: 20,
            borderRadius: 10,
            flex: 1,
          }}
        >
          <h3>Saldo</h3>
          <h2>
            Rp {saldo.toLocaleString("id-ID")}
          </h2>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: 10,
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          marginBottom: 30,
        }}
      >
        <input
          name="title"
          placeholder="Nama Transaksi"
          value={form.title}
          onChange={handleChange}
          required
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="Pemasukan">
            Pemasukan
          </option>

          <option value="Pengeluaran">
            Pengeluaran
          </option>
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Nominal"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <textarea
          rows="4"
          name="description"
          placeholder="Keterangan"
          value={form.description}
          onChange={handleChange}
        />

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <button type="submit">
            {editingId
              ? "Update Data"
              : "Tambah Data"}
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
            <th>Transaksi</th>
            <th>Jenis</th>
            <th>Nominal</th>
            <th>Tanggal</th>
            <th>Keterangan</th>
            <th width="170">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7">
                Memuat data...
              </td>
            </tr>
          ) : finances.length === 0 ? (
            <tr>
              <td colSpan="7">
                Tidak ada data
              </td>
            </tr>
          ) : (
            finances.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.title}</td>
                <td>{item.type}</td>
                <td>
                  Rp {Number(item.amount).toLocaleString("id-ID")}
                </td>
                <td>
                  {item.date
                    ? new Date(item.date).toLocaleDateString("id-ID")
                    : "-"}
                </td>
                <td>{item.description}</td>

                <td>
                  <button
                    onClick={() =>
                      handleEdit(item)
                    }
                  >
                    Edit
                  </button>

                  <button
                    style={{
                      marginLeft: 10,
                    }}
                    onClick={() =>
                      handleDelete(item._id)
                    }
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