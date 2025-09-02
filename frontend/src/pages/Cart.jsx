import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { apiCreateOrder } from "../api";

export default function Cart() {
  const { items, setQty, remove, totals, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function checkout() {
    setError("");
    setLoading(true);
    try {
      if (items.length === 0) throw new Error("Cart is empty");
      const payload = {
        items: items.map((i) => ({ product: i.product._id, quantity: i.qty })),
        shippingAddress: { fullName: "Test User", addressLine1: "N/A" },
        paymentMethod: "cod",
      };
      const order = await apiCreateOrder(payload);
      clear();
      nav(`/orders/${order._id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrap>
      <h1 className="text-xl font-semibold mb-4">Cart</h1>
      {items.length === 0 && <p>Your cart is empty.</p>}
      <ul className="space-y-3 mb-6">
        {items.map((i) => (
          <li
            key={i.product._id}
            className="flex items-center justify-between border rounded-md p-3 gap-4"
          >
            <div className="flex-1">
              <p className="font-medium text-sm">{i.product.name}</p>
              <p className="text-xs text-slate-500">${i.product.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={i.qty}
                onChange={(e) => setQty(i.product._id, +e.target.value)}
                className="w-16 rounded border px-1 py-0.5 text-sm"
              />
              <button
                onClick={() => remove(i.product._id)}
                className="text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="border rounded-lg p-4 max-w-sm space-y-2 bg-slate-50">
        <div className="flex justify-between text-sm">
          <span>Items Total</span>
          <span>${totals.itemsTotal.toFixed(2)}</span>
        </div>
        <button
          disabled={loading || items.length === 0}
          onClick={checkout}
          className="w-full rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 text-sm"
        >
          {loading ? "Placing order..." : "Checkout"}
        </button>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </PageWrap>
  );
}

function PageWrap({ children }) {
  return <div className="max-w-5xl mx-auto p-4 min-h-[60vh]">{children}</div>;
}
