import { useEffect, useState } from "react";
import {
  apiProducts,
  apiCreateProduct,
  apiDeleteProduct,
  apiUpdateProduct,
} from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const nav = useNavigate();
  const role = localStorage.getItem("role");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    if (role !== "admin") nav("/products");
  }, [role, nav]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiProducts();
      setProducts(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      await apiCreateProduct({
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        description: form.description.trim(),
      });
      setForm({ name: "", price: "", category: "", description: "" });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await apiDeleteProduct(id);
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (e) {
      alert(e.message);
    }
  }

  function handleEdit(product) {
    setEditingId(product._id);
    setEditForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description || "",
    });
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSave(id) {
    try {
      const updated = await apiUpdateProduct(id, {
        name: editForm.name.trim(),
        price: Number(editForm.price),
        category: editForm.category.trim(),
        description: editForm.description.trim(),
      });
      setProducts((p) => p.map((x) => (x._id === id ? updated : x)));
      setEditingId(null);
    } catch (e) {
      alert(e.message);
    }
  }

  function handleCancel() {
    setEditingId(null);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Admin Products</h1>
        <button
          onClick={load}
          className="self-start rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 text-sm shadow-sm transition-colors"
        >
          Refresh
        </button>
      </header>
      <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-slate-800">
          Create New Product
        </h2>
        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-600">
              Name
            </label>
            <input
              name="name"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-600">
              Price
            </label>
            <input
              name="price"
              placeholder="0.00"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-600">
              Category
            </label>
            <input
              name="category"
              placeholder="e.g., Electronics"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-600">
              Description
            </label>
            <input
              name="description"
              placeholder="Optional description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <button
            disabled={creating}
            className="sm:col-span-2 w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 text-sm shadow-sm transition-colors"
          >
            {creating ? "Creating..." : "Create Product"}
          </button>
        </form>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </p>
        )}
      </section>
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Existing Products
        </h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-sm text-slate-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">
              No products yet
            </h3>
            <p className="text-sm text-slate-500">
              Create your first product above.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-5 flex flex-col border border-slate-100"
              >
                {editingId === p._id ? (
                  <div className="space-y-4">
                    <input
                      name="name"
                      placeholder="Product name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <input
                      name="price"
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={handleEditChange}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <input
                      name="category"
                      placeholder="e.g., Electronics"
                      value={editForm.category}
                      onChange={handleEditChange}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <input
                      name="description"
                      placeholder="Optional description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(p._id)}
                        className="flex-1 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium py-2 text-sm shadow-sm transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 text-sm shadow-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-slate-800 mb-2 truncate text-base">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">
                      {p.category}
                    </p>
                    <p className="text-lg font-bold text-slate-900 mb-4">
                      ${p.price}
                    </p>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleEdit(p)}
                        className="flex-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2.5 text-sm border border-blue-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="flex-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 text-sm border border-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
