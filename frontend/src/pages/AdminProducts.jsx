import { useEffect, useState } from "react";
import { apiProducts, apiCreateProduct, apiDeleteProduct } from "../api";
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

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold">Admin Products</h1>
        <button
          onClick={load}
          className="self-start rounded-md border px-3 py-1.5 text-sm bg-white hover:bg-slate-50"
        >
          Refresh
        </button>
      </header>
      <section className="border rounded-lg p-4 bg-white space-y-4">
        <h2 className="font-medium text-sm">Create Product</h2>
        <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="rounded-md border px-2 py-1 text-sm"
          />
          <input
            name="price"
            placeholder="Price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
            className="rounded-md border px-2 py-1 text-sm"
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            className="rounded-md border px-2 py-1 text-sm"
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="rounded-md border px-2 py-1 text-sm"
          />
          <button
            disabled={creating}
            className="sm:col-span-2 rounded-md bg-blue-600 text-white text-sm py-2 hover:bg-blue-700 disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </section>
      <section>
        <h2 className="font-medium text-sm mb-3">Existing Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <div key={p._id} className="border rounded-md p-3 flex flex-col">
                <h3 className="font-medium text-sm mb-1 truncate">{p.name}</h3>
                <p className="text-xs text-slate-500 mb-1">{p.category}</p>
                <p className="text-sm font-semibold mb-3">${p.price}</p>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="mt-auto text-xs rounded-md bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-1"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        {!loading && products.length === 0 && <p>No products.</p>}
      </section>
    </div>
  );
}
