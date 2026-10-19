import BrandLogo from '../common/BrandLogo';

export default function Sidebar({ user, onLogout, currentView = 'dashboard', onNavigate }) {
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const currentUser = user || storedUser;
  const displayName = currentUser.name || 'Asesor';
  const displayRole = currentUser.role || 'Asesor Senior';

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  const handleNavClick = (event, view) => {
    event.preventDefault();
    if (typeof onNavigate === 'function') onNavigate(view);
  };

  const navClass = (view) => `flex min-w-max items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors md:w-full ${
    currentView === view
      ? 'border-white bg-white text-brand-blue shadow-sm'
      : 'border-transparent text-white/80 hover:bg-white/10 hover:text-white'
  }`;

  return (
    <aside className="flex w-full shrink-0 flex-col gap-2 border-b border-brand-blue-dark bg-brand-blue p-3 text-white select-none md:sticky md:top-0 md:h-screen md:w-64 md:self-start md:justify-between md:gap-0 md:border-b-0 md:border-r md:p-4">
      <div className="flex min-w-0 flex-col md:block">
        <div className="mb-2 flex items-center gap-3 px-1 py-1 md:mb-6 md:px-2 md:py-3">
          <div className="shrink-0 rounded-lg bg-white p-1.5 shadow-sm">
            <BrandLogo className="w-32 md:w-36" />
          </div>
          <p className="text-xs font-medium tracking-wide text-white/75">Portal de asesores</p>
        </div>

        <nav aria-label="Navegación del portal" className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
          <button onClick={(event) => handleNavClick(event, 'dashboard')} className={navClass('dashboard')}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0"><rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="4" rx="1"/><rect x="13.5" y="10.5" width="7" height="10" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/></svg>
            Dashboard
          </button>

          <button onClick={(event) => handleNavClick(event, 'leads')} className={`${navClass('leads')} justify-between`}>
            <span className="flex items-center gap-3">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0"><circle cx="9" cy="8" r="3.25"/><path strokeLinecap="round" d="M3.5 19c.6-3.1 2.4-4.7 5.5-4.7s4.9 1.6 5.5 4.7M17 6.5a3 3 0 010 5.8m1 2.2c1.5.7 2.4 2.2 2.7 4.5"/></svg>
              Leads
            </span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold text-white">1</span>
          </button>

          <button onClick={(event) => handleNavClick(event, 'ventas')} className={navClass('ventas')}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5h16M6.5 16V11m5 5V5m5 11V8"/></svg>
            Mis ventas
          </button>
        </nav>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3 border-t border-white/15 pt-3 md:mt-0 md:block md:space-y-3 md:pt-4">
        <div className="flex min-w-0 items-center gap-3 px-1 md:px-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-xs font-semibold text-white">
            {getInitials(displayName)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{displayName}</p>
            <p className="truncate text-xs text-white/65">{displayRole}</p>
          </div>
        </div>

        <button
          onClick={handleLogoutClick}
          className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white md:w-full"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10 17l5-5-5-5m5 5H3.5M13 4h5.5A2.5 2.5 0 0121 6.5v11a2.5 2.5 0 01-2.5 2.5H13"/></svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
