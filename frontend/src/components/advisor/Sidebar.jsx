import React from 'react';

export default function Sidebar({ user, onLogout }) {
  // 1. Obtiene el usuario de las props o del localStorage guardado durante el Login
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const currentUser = user || storedUser;

  const displayName = currentUser.name || 'Asesor';
  const displayRole = currentUser.role || 'Asesor Senior';

  // Función para obtener las iniciales del nombre
  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

const handleLogoutClick = () => {
    // 1. Limpiamos las credenciales almacenadas
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 2. Notificamos al componente padre (App.jsx) para cambiar el estado de React
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      // Fallback en caso de que no se haya pasado la función
      window.location.reload();
    }
  };

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between h-screen sticky top-0 p-4 border-r border-slate-800 select-none">
      {/* Sección Superior: Logo y Enlaces */}
      <div>
        {/* Logo del Portal */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="bg-amber-500 text-slate-950 p-2 rounded-lg font-bold">
            ✈️
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight">Vacaciones</h1>
            <p className="text-xs text-slate-400">Portal Asesores</p>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="space-y-1">
          <a
            href="#dashboard"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl bg-slate-800 text-amber-400 border border-slate-700/60 shadow-sm"
          >
            <span>📊</span>
            Dashboard
          </a>

          <a
            href="#leads"
            className="flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <span>👥</span>
              Leads
            </div>
            <span className="bg-rose-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              1
            </span>
          </a>

          <a
            href="#ventas"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors"
          >
            <span>📈</span>
            Mis ventas
          </a>
        </nav>
      </div>

      {/* Sección Inferior: Perfil del Asesor Dinámico */}
      <div className="border-t border-slate-800 pt-4 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold flex items-center justify-center text-xs">
            {getInitials(displayName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-slate-400 truncate">{displayRole}</p>
          </div>
        </div>

        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800/40 rounded-lg transition-colors cursor-pointer"
        >
          <span>🚪</span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}