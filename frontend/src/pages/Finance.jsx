import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";

const FINANCE_CATEGORIES = [
  'infaq', 'zakat', 'sedekah', 'donasi', 
  'operasional', 'pembangunan', 'perawatan', 
  'gaji', 'listrik', 'air', 'kebersihan', 
  'kegiatan', 'lainnya'
];

export default function Finance() {
  const emptyForm = {
    title: "",
    type: "income",
    category: "infaq",
    donorName: "",
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
      type: item.type || "income",
      category: item.category || "lainnya",
      donorName: item.donorName || "",
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
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount), 0);

  const totalPengeluaran = finances
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  const saldo = totalPemasukan - totalPengeluaran;

  const showDonorField = form.type === 'income' && ['donasi', 'infaq', 'zakat', 'sedekah'].includes(form.category);

  return (
    <MainLayout>
      <div style={{ paddingBottom: '40px' }}>
        <h2 style={{ marginBottom: '24px' }}>Manajemen Keuangan</h2>

        <div style={{ display: "flex", gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: "linear-gradient(135deg, #4CAF50, #2E7D32)", color: "white", padding: '24px', borderRadius: '12px', flex: 1, boxShadow: '0 4px 12px rgba(76,175,80,0.2)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 500, opacity: 0.9 }}>Total Pemasukan</h3>
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Rp {totalPemasukan.toLocaleString("id-ID")}</h2>
          </div>

          <div style={{ background: "linear-gradient(135deg, #F44336, #C62828)", color: "white", padding: '24px', borderRadius: '12px', flex: 1, boxShadow: '0 4px 12px rgba(244,67,54,0.2)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 500, opacity: 0.9 }}>Total Pengeluaran</h3>
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Rp {totalPengeluaran.toLocaleString("id-ID")}</h2>
          </div>

          <div style={{ background: "linear-gradient(135deg, #2196F3, #1565C0)", color: "white", padding: '24px', borderRadius: '12px', flex: 1, boxShadow: '0 4px 12px rgba(33,150,243,0.2)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 500, opacity: 0.9 }}>Saldo Saat Ini</h3>
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Rp {saldo.toLocaleString("id-ID")}</h2>
          </div>
        </div>

        <div style={{ background: "#fff", padding: '24px', borderRadius: '12px', marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem' }}>{editingId ? "Edit Transaksi" : "Tambah Transaksi"}</h3>
          
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: '20px' }}>
            
            <div className="form-group">
              <label>Nama Transaksi</label>
              <input className="form-control" name="title" placeholder="Masukkan judul/keterangan singkat" value={form.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Jenis Transaksi</label>
              <select className="form-control" name="type" value={form.type} onChange={handleChange}>
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>

            <div className="form-group">
              <label>Kategori</label>
              <select className="form-control" name="category" value={form.category} onChange={handleChange} required>
                {FINANCE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            {showDonorField && (
              <div className="form-group">
                <label>Nama Donatur (Opsional)</label>
                <input className="form-control" name="donorName" placeholder="Hamba Allah" value={form.donorName} onChange={handleChange} />
              </div>
            )}

            <div className="form-group">
              <label>Nominal (Rp)</label>
              <input className="form-control" type="number" name="amount" placeholder="0" value={form.amount} onChange={handleChange} required min="0" />
            </div>

            <div className="form-group">
              <label>Tanggal Transaksi</label>
              <input className="form-control" type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Keterangan Lengkap</label>
              <textarea className="form-control" rows="3" name="description" placeholder="Catatan opsional..." value={form.description} onChange={handleChange} />
            </div>

            <div style={{ display: "flex", gap: '12px', gridColumn: '1 / -1', marginTop: '8px' }}>
              <button className="btn btn-primary" type="submit">
                {editingId ? "Update Data" : "Simpan Data"}
              </button>
              <button className="btn btn-secondary" type="button" onClick={resetForm}>
                Batal
              </button>
            </div>
          </form>
        </div>

        <div style={{ background: "#fff", padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem' }}>Riwayat Keuangan</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="table-modern">
              <thead>
                <tr>
                  <th width="50">No</th>
                  <th>Tanggal</th>
                  <th>Transaksi</th>
                  <th>Jenis</th>
                  <th>Kategori</th>
                  <th>Nominal</th>
                  <th width="160">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</td>
                  </tr>
                ) : finances.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Tidak ada data keuangan</td>
                  </tr>
                ) : (
                  finances.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.date ? new Date(item.date).toLocaleDateString("id-ID") : "-"}</td>
                      <td>
                        <strong>{item.title}</strong>
                        {item.donorName && <div style={{ fontSize: '0.85em', color: '#666' }}>Donatur: {item.donorName}</div>}
                      </td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '0.85em', 
                          fontWeight: 500,
                          backgroundColor: item.type === 'income' ? '#e8f5e9' : '#ffebee',
                          color: item.type === 'income' ? '#2e7d32' : '#c62828'
                        }}>
                          {item.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{item.category}</td>
                      <td style={{ fontWeight: 600 }}>Rp {Number(item.amount).toLocaleString("id-ID")}</td>
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