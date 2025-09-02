import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiOrderById } from "../api";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await apiOrderById(id);
        setOrder(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <PageWrap>Loading...</PageWrap>;
  if (error) return <PageWrap>Error: {error}</PageWrap>;
  if (!order) return <PageWrap>Order not found</PageWrap>;
  return (
    <PageWrap>
      <h1 className="text-xl font-semibold mb-2">Order #{order._id}</h1>
      <p className="text-sm mb-4">Status: {order.status}</p>
      <div className="space-y-4">
        <section>
          <h2 className="font-medium mb-2 text-sm">Items</h2>
          <ul className="space-y-2 text-sm">
            {order.items?.map((i) => (
              <li key={i._id} className="flex justify-between">
                <span>
                  {i.name} x {i.quantity}
                </span>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </section>
        {order.pricing && (
          <section className="text-sm space-y-1">
            <h2 className="font-medium">Pricing</h2>
            <p>Items: ${order.pricing.itemsTotal?.toFixed(2)}</p>
            <p>Tax: ${order.pricing.tax?.toFixed(2)}</p>
            <p>Shipping: ${order.pricing.shipping?.toFixed(2)}</p>
            <p className="font-semibold">
              Grand Total: ${order.pricing.grandTotal?.toFixed(2)}
            </p>
          </section>
        )}
      </div>
    </PageWrap>
  );
}

function PageWrap({ children }) {
  return <div className="max-w-3xl mx-auto p-4 min-h-[60vh]">{children}</div>;
}
