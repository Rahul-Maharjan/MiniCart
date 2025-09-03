import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiMyOrders } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await apiMyOrders();
        setOrders(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <PageWrap>Loading orders...</PageWrap>;
  if (error) return <PageWrap>Error: {error}</PageWrap>;
  return (
    <PageWrap>
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 max-w-4xl mx-auto font-mono text-sm">
        {/* Header */}
        <div className="text-center border-b border-dashed border-slate-300 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Order History
          </h1>
          <p className="text-xs text-slate-500">Your past purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-lg font-medium text-slate-600 mb-2">
              No orders available
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Check back later for new orders.
            </p>
            <Link
              to="/products"
              className="inline-block rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 text-sm transition-colors"
            >
              Go Shopping
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((o) => (
              <li
                key={o._id}
                className="border border-dashed border-slate-300 rounded-md p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">
                      Order #{o._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-500">
                      Date: {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      Items: {o.items?.length} | Status:{" "}
                      <span className="font-medium">{o.status}</span>
                    </p>
                    {o.pricing && (
                      <p className="text-xs text-slate-500">
                        Total: ${o.pricing.grandTotal?.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <Link
                    to={o._id}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 text-xs transition-colors"
                  >
                    View Receipt
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageWrap>
  );
}

function PageWrap({ children }) {
  return <div className="max-w-4xl mx-auto p-4 min-h-[60vh]">{children}</div>;
}
