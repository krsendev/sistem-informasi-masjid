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
      <h2>Manajemen User</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: 10,
          marginTop: 20,
          marginBottom: 30,
          background: "#fff",
          padding: 20,
          borderRadius: 10,
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Nama"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder={
            editingId
              ? "Kosongkan jika tidak ingin mengganti password"
              : "Password"
          }
          value={form.password}
          onChange={handleChange}
          required={!editingId}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <button type="submit">
            {editingId
              ? "Update User"
              : "Tambah User"}
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
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th width="170">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5">
                Memuat data...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="5">
                Tidak ada data
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>

                <td>
                  <button
                    onClick={() =>
                      handleEdit(user)
                    }
                  >
                    Edit
                  </button>

                  <button
                    style={{
                      marginLeft: 10,
                    }}
                    onClick={() =>
                      handleDelete(user._id)
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