// Minimal API helpers
const BASE_URL =
  import.meta?.env?.VITE_API_BASE || "https://mini-cart-amber.vercel.app";

function getToken() {
  return localStorage.getItem("token");
}

async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch (_) {}
  if (!res.ok)
    throw new Error(
      data?.message || data?.error || `Request failed (${res.status})`
    );
  return data;
}

export const apiProducts = () => api("/api/products", { auth: false });
export const apiCreateProduct = (payload) =>
  api("/api/products", { method: "POST", body: payload });
export const apiDeleteProduct = (id) =>
  api(`/api/products/${id}`, { method: "DELETE" });
export const apiCreateOrder = (payload) =>
  api("/api/orders", { method: "POST", body: payload });
export const apiMyOrders = () => api("/api/orders/my");
export const apiOrderById = (id) => api(`/api/orders/${id}`);

export { BASE_URL };
