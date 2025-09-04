import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useCallback } from "react";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Products from "./pages/Products.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Cart from "./pages/Cart.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Account from "./pages/Account.jsx";
import { CartProvider } from "./CartContext.jsx";
import { WishlistProvider } from "./WishlistContext.jsx";
import { ToastProvider } from "./ToastContext.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    () => !!localStorage.getItem("loggedIn")
  );

  const handleLogin = useCallback((token) => {
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("loggedIn", "1");
    setLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("token");
    setLoggedIn(false);
  }, []);

  return (
    <BrowserRouter>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar loggedIn={loggedIn} onLogout={handleLogout} />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route
                    path="/login"
                    element={
                      loggedIn ? (
                        <Navigate to="/products" replace />
                      ) : (
                        <Login onLogin={handleLogin} />
                      )
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      loggedIn ? <Navigate to="/products" replace /> : <Signup />
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      loggedIn ? <Products /> : <Navigate to="/login" replace />
                    }
                  />
                  <Route
                    path="/cart"
                    element={loggedIn ? <Cart /> : <Navigate to="/login" replace />}
                  />
                  <Route
                    path="/wishlist"
                    element={loggedIn ? <Wishlist /> : <Navigate to="/login" replace />}
                  />
                  <Route
                    path="/orders"
                    element={loggedIn ? <Orders /> : <Navigate to="/login" replace />}
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      loggedIn ? <OrderDetail /> : <Navigate to="/login" replace />
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      loggedIn ? <Account /> : <Navigate to="/login" replace />
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      loggedIn && localStorage.getItem("role") === "admin" ? (
                        <AdminProducts />
                      ) : (
                        <Navigate to="/products" replace />
                      )
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
