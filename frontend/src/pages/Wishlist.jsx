import { useWishlist } from "../WishlistContext";
import { useCart } from "../CartContext";
import { useToast } from "../ToastContext";

export default function Wishlist() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { add } = useCart();
  const toast = useToast();

  const handleAddToCart = (product) => {
    add(product);
    toast?.push(`Added ${product.name} to cart`);
  };

  const handleRemoveFromWishlist = (productId, productName) => {
    removeFromWishlist(productId);
    toast?.push(`Removed ${productName} from wishlist`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Wishlist</h1>
        <p className="text-slate-600">
          {items.length === 0 ? "Your wishlist is empty" : `${items.length} item${items.length > 1 ? 's' : ''} in your wishlist`}
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-slate-600">
              {items.length} item{items.length > 1 ? 's' : ''} saved
            </p>
            <button
              onClick={() => {
                clearWishlist();
                toast?.push("Wishlist cleared");
              }}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <WishlistItem
                key={product._id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
                onRemove={() => handleRemoveFromWishlist(product._id, product.name)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function WishlistItem({ product, onAddToCart, onRemove }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 flex flex-col border border-slate-100 group relative">
      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors text-slate-400 hover:text-red-500"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Product Image Placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
        <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-slate-900 mb-2 text-lg leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 uppercase tracking-wide mb-3">
          {product.category}
        </p>
        {product.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-slate-900">
            ${product.price}
          </span>
        </div>
        <button
          onClick={onAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13h10m0 0v8a2 2 0 002 2H5a2 2 0 01-2-2v-3.6" />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function EmptyWishlist() {
  return (
    <div className="text-center py-16">
      <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-slate-900 mb-4">
        Your wishlist is empty
      </h3>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        Save items you love for later! Click the heart icon on products to add them to your wishlist.
      </p>
      <a
        href="/products"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        Browse Products
      </a>
    </div>
  );
}
