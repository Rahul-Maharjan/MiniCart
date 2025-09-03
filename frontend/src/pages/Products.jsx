import { useEffect, useState } from "react";
import { apiProducts } from "../api";
import { useCart } from "../CartContext";
import { useToast } from "../ToastContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { add } = useCart();
  const toast = useToast();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await apiProducts();
        if (active) setProducts(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <PageWrap>Loading products...</PageWrap>;
  if (error) return <PageWrap>Error: {error}</PageWrap>;
  return (
    <PageWrap>
      <h1 className="text-xl font-semibold mb-4">Products</h1>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-lg font-medium text-slate-600 mb-2">
            No products available
          </h2>
          <p className="text-sm text-slate-500">
            Check back later for new items.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-5 flex flex-col border border-slate-100"
            >
              <h2 className="font-semibold text-slate-800 mb-2 truncate text-base">
                {p.name}
              </h2>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">
                {p.category}
              </p>
              <p className="text-lg font-bold text-slate-900 mb-4">
                ${p.price}
              </p>
              <button
                onClick={() => {
                  add(p);
                  toast?.push(`Added ${p.name} to cart`);
                }}
                className="mt-auto w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 text-sm transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </PageWrap>
  );
}

function PageWrap({ children }) {
  return <div className="max-w-5xl mx-auto p-4 min-h-[60vh]">{children}</div>;
}
