import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ loggedIn, onLogout }) {
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const baseLinkClasses =
    "relative px-3 py-2 text-sm font-medium transition-colors text-slate-600 hover:text-slate-900";
  const activeClasses =
    "text-slate-900 after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-blue-600";

  function linkClass({ isActive }) {
    return isActive ? `${baseLinkClasses} ${activeClasses}` : baseLinkClasses;
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Link
              to={loggedIn ? "/products" : "/"}
              className="text-lg font-semibold tracking-tight text-slate-800"
            >
              Mini<span className="text-blue-600">Cart</span>
            </Link>
          </div>
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/products" className={linkClass}>
              Products
            </NavLink>
            <NavLink to="/cart" className={linkClass}>
              Cart
            </NavLink>
            <NavLink to="/orders" className={linkClass}>
              Orders
            </NavLink>
            {localStorage.getItem("role") === "admin" && (
              <NavLink to="/admin/products" className={linkClass}>
                Admin
              </NavLink>
            )}
          </div>
          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {!loggedIn && (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  Sign Up
                </Link>
              </>
            )}
            {loggedIn && (
              <>
                <button
                  onClick={() => nav("/account")}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Account
                </button>
                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    nav("/login");
                  }}
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  Logout
                </button>
              </>
            )}
          </div>
          {/* Mobile button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="px-4 py-4 flex flex-col gap-2">
            <NavLink
              onClick={() => setMobileOpen(false)}
              to="/products"
              className={linkClass}
              end
            >
              Home
            </NavLink>
            <NavLink
              onClick={() => setMobileOpen(false)}
              to="/products"
              className={linkClass}
            >
              Products
            </NavLink>
            <NavLink
              onClick={() => setMobileOpen(false)}
              to="/cart"
              className={linkClass}
            >
              Cart
            </NavLink>
            <NavLink
              onClick={() => setMobileOpen(false)}
              to="/orders"
              className={linkClass}
            >
              Orders
            </NavLink>
            {localStorage.getItem("role") === "admin" && (
              <NavLink
                onClick={() => setMobileOpen(false)}
                to="/admin/products"
                className={linkClass}
              >
                Admin
              </NavLink>
            )}
            {!loggedIn && (
              <>
                <NavLink
                  onClick={() => setMobileOpen(false)}
                  to="/login"
                  className={linkClass}
                >
                  Login
                </NavLink>
                <NavLink
                  onClick={() => setMobileOpen(false)}
                  to="/signup"
                  className={linkClass}
                >
                  Sign Up
                </NavLink>
              </>
            )}
            {loggedIn && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  if (onLogout) onLogout();
                  nav("/login");
                }}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 border border-red-200"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
