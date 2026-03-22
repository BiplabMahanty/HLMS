import React, { useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";

export default function AdminLayout() {
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
    const apiUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    console.log("API URL in Sidebar:", `${apiUrl}/${user.adminImage}`); // Debugging line to check API URL
    
  return (
    <div className="flex min-h-screen bg-[#E8F0F8]">
      
      {/* SIDEBAR (ALWAYS VISIBLE) */}
      <aside className="w-64 bg-[#0A1D3A] text-white p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gray-300">
 {user.adminImage ? (
      <img 
        src={`${apiUrl}/${user.adminImage}`} 
        alt="Admin" 
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
      </div>
    )}
    </div>
              <div>
            <h1 className="text-lg font-semibold">{user.username || 'Admin'}</h1>
            <p className="text-sm opacity-70">{user.role || 'User'}</p>
          </div>
        </div>

        <nav className="space-y-3">
          <NavLink to="/" className={linkClass}>
           Dashboard
          </NavLink>
          <NavLink to="/home" className={linkClass}>
           Ticket Assignment
          </NavLink>
          <NavLink to="/delete" className={linkClass}>
           Return Tickets
          </NavLink>
          <NavLink to="/payment" className={linkClass}>
           Payment Tickets
          </NavLink>
          <NavLink to="/paymentView" className={linkClass}>
           Payment Details
          </NavLink>
          <NavLink to="/addSeller" className={linkClass}>
           Create Seller
          </NavLink>
          <NavLink to="/client" className={linkClass}>
           Client
          </NavLink>
        
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 text-left">
           Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT (CHANGES, SIDEBAR STAYS) */}
      <main className="flex-1 p-5 overflow-y-auto">
        <Outlet/>
      </main>
    </div>
  );
}
