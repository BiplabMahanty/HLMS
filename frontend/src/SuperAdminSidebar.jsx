import React from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";

export default function SuperAdminSidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `w-full flex items-center gap-3 p-3 rounded-lg ${
      isActive ? "bg-yellow-500 text-black" : "hover:bg-white/10"
    }`;

  return (
    <div className="flex min-h-screen bg-[#E8F0F8]">
      <aside className="w-64 bg-[#0A1D3A] text-white p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">SA</div>
          <div>
            <h1 className="text-lg font-semibold">{user.username || 'SuperAdmin'}</h1>
            <p className="text-sm opacity-70">{user.role || 'SuperAdmin'}</p>
          </div>
        </div>

        <nav className="space-y-3">
          <NavLink to="/superadmin/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/superadmin/admin-create" className={linkClass}>
            Admin Create
          </NavLink>
          <NavLink to="/superadmin/add-lottery-type" className={linkClass}>
            Add Lottery Type
          </NavLink>
          <NavLink to="/superadmin/seller-suspend" className={linkClass}>
            Manage Sellers
          </NavLink>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 text-left">
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-5 overflow-y-auto">
        <Outlet/>
      </main>
    </div>
  );
}
