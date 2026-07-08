import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";

export default function Users() {
  const emptyForm = {
    name: "",
    email: "",
    password: "",
    role: "admin",
  };

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/users");

      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
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
        await api.put(`/users/${editingId}`, form);

        alert("User berhasil diperbarui");
      } else {
        await api.post("/users", form);

        alert("User berhasil ditambahkan");
      }

      resetForm();
      getUsers();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Terjadi kesalahan."
      );
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);

    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "admin",
    });
  };

  const handleDelete = async (id) => {
    const konfirmasi = window.confirm(
      "Yakin ingin menghapus user?"
    );

    if (!konfirmasi) return;

    try {
      await api.delete(`/users/${id}`);

      alert("User berhasil dihapus");

      getUsers();
    } catch (err) {
      console.error(err);

      alert("Gagal menghapus user");
    }
  };

  return (
    <MainLayout>
      <div style={{ paddingBottom: '40px' }}>
        <h2 style={{ marginBottom: '24px' }}>Manajemen User</h2>

        <div style={{ background: "#fff", padding: '24px', borderRadius: '12px', marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem' }}>{editingId ? "Edit User" : "Tambah User"}</h3>
          
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: '20px' }}>
            
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input className="form-control" type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Alamat Email</label>
              <input className="form-control" type="email" name="email" placeholder="email@example.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                className="form-control" 
                type="password" 
                name="password" 
                placeholder={editingId ? "Kosongkan jika tidak diganti" : "Password kuat"} 
                value={form.password} 
                onChange={handleChange} 
                required={!editingId} 
              />
            </div>

            <div className="form-group">
              <label>Hak Akses (Role)</label>
              <select className="form-control" name="role" value={form.role} onChange={handleChange}>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: '12px', gridColumn: '1 / -1', marginTop: '8px' }}>
              <button className="btn btn-primary" type="submit">
                {editingId ? "Update User" : "Simpan Data"}
              </button>
              <button className="btn btn-secondary" type="button" onClick={resetForm}>
                Batal
              </button>
            </div>
          </form>
        </div>

        <div style={{ background: "#fff", padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem' }}>Daftar Pengguna</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="table-modern">
              <thead>
                <tr>
                  <th width="50">No</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th width="160">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Tidak ada data pengguna</td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td style={{ fontWeight: 500 }}>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '0.85em', 
                          fontWeight: 500,
                          backgroundColor: user.role === 'superadmin' ? '#e3f2fd' : '#f5f5f5',
                          color: user.role === 'superadmin' ? '#1565c0' : '#424242'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', marginRight: '8px' }} onClick={() => handleEdit(user)}>Edit</button>
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => handleDelete(user._id)}>Hapus</button>
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