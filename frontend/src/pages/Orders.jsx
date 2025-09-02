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
      <h1 className="text-xl font-semibold mb-4">My Orders</h1>
      {orders.length === 0 && <p>No orders yet.</p>}
      <ul className="space-y-3">
        {orders.map((o) => (
          <li
            key={o._id}
            className="border rounded-md p-3 flex justify-between items-center text-sm"
          >
            <div>
              <p className="font-medium">{o.items?.length} items</p>
              <p className="text-xs text-slate-500">Status: {o.status}</p>
            </div>
            <Link
              to={o._id}
              className="text-blue-600 hover:underline text-xs font-medium"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </PageWrap>
  );
}

function PageWrap({ children }) {
  return <div className="max-w-4xl mx-auto p-4 min-h-[60vh]">{children}</div>;
}
