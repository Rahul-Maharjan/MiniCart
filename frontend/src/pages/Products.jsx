import { useEffect, useState, useMemo } from "react";
import { apiProducts } from "../api";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import { useToast } from "../ToastContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
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

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  if (loading) return <PageWrap><LoadingSpinner /></PageWrap>;
  if (error) return <PageWrap><ErrorMessage message={error} /></PageWrap>;

  return (
    <PageWrap>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Our Products</h1>
        <p className="text-slate-600">Discover amazing products at great prices</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-slate-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState searchTerm={searchTerm} selectedCategory={selectedCategory} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={() => {
                add(product);
                toast?.push(`Added ${product.name} to cart`);
              }}
            />
          ))}
        </div>
      )}
    </PageWrap>
  );
}

function ProductCard({ product, onAddToCart }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const toast = useToast();

  const handleWishlistToggle = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast?.push(`Removed ${product.name} from wishlist`);
    } else {
      addToWishlist(product);
      toast?.push(`Added ${product.name} to wishlist`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 flex flex-col border border-slate-100 group relative">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
      >
        <svg
          className={`w-5 h-5 ${isInWishlist(product._id) ? 'text-red-500 fill-current' : 'text-slate-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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

function EmptyState({ searchTerm, selectedCategory }) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {searchTerm || selectedCategory !== "All" ? "No products found" : "No products available"}
      </h3>
      <p className="text-slate-600 mb-6">
        {searchTerm || selectedCategory !== "All"
          ? "Try adjusting your search or filter criteria"
          : "Check back later for new items"
        }
      </p>
      {(searchTerm || selectedCategory !== "All") && (
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Products</h3>
      <p className="text-slate-600">{message}</p>
    </div>
  );
}

function PageWrap({ children }) {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh]">
      {children}
    </div>
  );
}
