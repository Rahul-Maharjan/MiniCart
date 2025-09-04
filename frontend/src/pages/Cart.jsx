import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { apiCreateOrder } from "../api";

export default function Cart() {
  const { items, setQty, remove, totals, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });
  const nav = useNavigate();

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  async function checkout() {
    setError("");

    // Validate shipping info
    if (!shippingInfo.fullName || !shippingInfo.addressLine1 || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode) {
      setError("Please fill in all required shipping information");
      return;
    }

    setLoading(true);
    try {
      if (items.length === 0) throw new Error("Cart is empty");

      const payload = {
        items: items.map((i) => ({ product: i.product._id, quantity: i.qty })),
        shippingAddress: {
          fullName: shippingInfo.fullName,
          addressLine1: shippingInfo.addressLine1,
          addressLine2: shippingInfo.addressLine2,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country
        },
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Shopping Cart</h1>
        <p className="text-slate-600">
          {items.length === 0 ? "Your cart is empty" : `${items.length} item${items.length > 1 ? 's' : ''} in your cart`}
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-900">Cart Items</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <CartItem
                    key={item.product._id}
                    item={item}
                    onUpdateQty={(qty) => setQty(item.product._id, qty)}
                    onRemove={() => remove(item.product._id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal ({items.length} items)</span>
                  <span className="font-medium">${totals.itemsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-slate-900">Total</span>
                    <span className="text-slate-900">${totals.itemsTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleShippingChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={shippingInfo.addressLine1}
                    onChange={handleShippingChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={shippingInfo.addressLine2}
                    onChange={handleShippingChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Apt, Suite, etc."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="NY"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Country
                    </label>
                    <select
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <button
                disabled={loading || items.length === 0}
                onClick={checkout}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Complete Order
                  </>
                )}
              </button>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </PageWrap>
  );
}

function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4">
        {/* Product Image Placeholder */}
        <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-lg mb-1 truncate">
            {item.product.name}
          </h3>
          <p className="text-sm text-slate-500 mb-2">
            ${item.product.price} each
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Qty:</label>
              <select
                value={item.qty}
                onChange={(e) => onUpdateQty(Number(e.target.value))}
                className="px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <button
              onClick={onRemove}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove
            </button>
          </div>
        </div>

        <div className="text-right">
          <p className="font-semibold text-slate-900 text-lg">
            ${(item.product.price * item.qty).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13h10m0 0v8a2 2 0 002 2H5a2 2 0 01-2-2v-3.6" />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-slate-900 mb-4">
        Your cart is empty
      </h3>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
      </p>
      <a
        href="/products"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        Continue Shopping
      </a>
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
