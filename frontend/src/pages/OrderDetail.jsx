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
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 max-w-2xl mx-auto font-mono text-sm">
        {/* Receipt Header */}
        <div className="text-center border-b border-dashed border-slate-300 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            MiniCart Receipt
          </h1>
          <p className="text-xs text-slate-500">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-slate-500">
            Date: {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-slate-500">
            Status: <span className="font-semibold">{order.status}</span>
          </p>
        </div>

        {/* Items Section */}
        <div className="mb-6">
          <h2 className="font-semibold text-slate-800 mb-3">Items Purchased</h2>
          <div className="space-y-2">
            {order.items?.map((i, index) => (
              <div
                key={i._id}
                className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2"
              >
                <div className="flex-1">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-xs text-slate-500">Qty: {i.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${(i.price * i.quantity).toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500">${i.price} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        {order.pricing && (
          <div className="border-t border-dashed border-slate-300 pt-4">
            <h2 className="font-semibold text-slate-800 mb-3">Order Summary</h2>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${order.pricing.itemsTotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.pricing.tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.pricing.shipping?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-solid border-slate-300 pt-2 mt-2">
                <span>Total:</span>
                <span>${order.pricing.grandTotal?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center border-t border-dashed border-slate-300 pt-4 mt-6">
          <p className="text-xs text-slate-500">
            Thank you for shopping with MiniCart!
          </p>
          <p className="text-xs text-slate-500">
            For inquiries, contact support@minicart.com
          </p>
        </div>
      </div>
    </PageWrap>
  );
}

function PageWrap({ children }) {
  return <div className="max-w-3xl mx-auto p-4 min-h-[60vh]">{children}</div>;
}
