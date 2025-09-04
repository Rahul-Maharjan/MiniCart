import { useEffect, useState } from "react";
import { apiGetUserDetails, apiUpdatePassword } from "../api";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      nav("/login");
      return;
    }
    loadUser();
  }, [nav]);

  async function loadUser() {
    setLoading(true);
    setError("");
    try {
      const data = await apiGetUserDetails();
      setUser(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswordForm((f) => ({ ...f, [name]: value }));
  }

  async function handleUpdatePassword(e) {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    setUpdating(true);
    setError("");
    try {
      await apiUpdatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password updated successfully");
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">My Account</h1>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Account Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600">Name</label>
            <p className="mt-1 text-slate-900">{user?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Email</label>
            <p className="mt-1 text-slate-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Address</label>
            <p className="mt-1 text-slate-900">{user?.address || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Role</label>
            <p className="mt-1 text-slate-900 capitalize">{user?.role}</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Change Password</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={updating}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 text-sm shadow-sm transition-colors"
          >
            {updating ? "Updating..." : "Update Password"}
          </button>
        </form>
      </section>
    </div>
  );
}
