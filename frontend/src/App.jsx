import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useCallback } from "react";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Navbar from "./components/Navbar.jsx";
import Products from "./pages/Products.jsx";
import Cart from "./pages/Cart.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import { CartProvider } from "./CartContext.jsx";

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
      <CartProvider>
        {loggedIn && <Navbar loggedIn={loggedIn} onLogout={handleLogout} />}
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to={loggedIn ? "/products" : "/login"} replace />
            }
          />
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
            element={loggedIn ? <Products /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/cart"
            element={loggedIn ? <Cart /> : <Navigate to="/login" replace />}
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
