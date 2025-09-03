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
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-lg font-medium text-slate-600 mb-2">
            Your cart is empty
          </h2>
          <p className="text-sm text-slate-500">
            Add some products to get started.
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-4 mb-8">
            {items.map((i) => (
              <li
                key={i.product._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 border border-slate-100"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-base mb-1">
                      {i.product.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      ${i.product.price} each
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-slate-600">Qty:</label>
                      <input
                        type="number"
                        min={1}
                        value={i.qty}
                        onChange={(e) => setQty(i.product._id, +e.target.value)}
                        className="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                    <button
                      onClick={() => remove(i.product._id)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-md ml-auto">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Items Total</span>
                <span className="font-medium">
                  ${totals.itemsTotal.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              disabled={loading || items.length === 0}
              onClick={checkout}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 text-sm shadow-sm transition-colors"
            >
              {loading ? "Placing order..." : "Checkout"}
            </button>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                {error}
              </p>
            )}
          </div>
        </>
      )}
    </PageWrap>
  );
}

function PageWrap({ children }) {
  return <div className="max-w-5xl mx-auto p-4 min-h-[60vh]">{children}</div>;
}
