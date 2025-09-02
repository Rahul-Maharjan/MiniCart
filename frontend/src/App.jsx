import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useCallback } from "react";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import HelloWorld from "./pages/HelloWorld.jsx";
import Navbar from "./components/Navbar.jsx";

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
      {loggedIn && <Navbar loggedIn={loggedIn} onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={<Navigate to={loggedIn ? "/hello" : "/login"} replace />}
        />
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/hello" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={loggedIn ? <Navigate to="/hello" replace /> : <Signup />}
        />
        <Route
          path="/hello"
          element={
            loggedIn ? (
              <HelloWorld onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
