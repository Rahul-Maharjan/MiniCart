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
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div key={p._id} className="border rounded-lg p-4 flex flex-col">
            <h2 className="font-medium mb-1 truncate">{p.name}</h2>
            <p className="text-sm text-slate-500 mb-2">{p.category}</p>
            <p className="font-semibold mb-4">${p.price}</p>
            <button
              onClick={() => {
                add(p);
                toast?.push(`Added ${p.name} to cart`);
              }}
              className="mt-auto text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white py-1.5"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

function PageWrap({ children }) {
  return <div className="max-w-5xl mx-auto p-4 min-h-[60vh]">{children}</div>;
}
