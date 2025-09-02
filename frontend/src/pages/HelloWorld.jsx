import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function HelloWorld({ onLogout }) {
  const nav = useNavigate();
  const loggedIn = !!localStorage.getItem("loggedIn");

  useEffect(() => {
    if (!loggedIn) nav("/login");
  }, [loggedIn, nav]);

  function logout() {
    if (onLogout) onLogout();
    else {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("token");
    }
    nav("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow p-8 space-y-6 text-center">
        <h1 className="text-3xl font-bold">Hello World</h1>
        <button
          onClick={logout}
          className="w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
