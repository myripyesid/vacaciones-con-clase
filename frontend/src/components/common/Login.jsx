import { useState } from 'react';

export default function Login({ onLoginSuccess, onGoHome }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.non_field_errors?.[0] || 'Credenciales inválidas');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        name: data.user_name || username,
        role: data.role || 'Asesor Senior'
      }));

      onLoginSuccess(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAF8F5]">
      {/* Columna Izquierda - Imagen de fondo con overlay y texto informativo */}
      <div 
        className="relative md:w-1/2 min-h-[300px] md:min-h-screen bg-cover bg-center flex flex-col justify-between p-8 md:p-12 text-white"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1583531172005-814191b8b6c0?q=80&w=1200&auto=format&fit=crop')`
        }}
      >
        {/* Branding superior izquierdo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D4A338] flex items-center justify-center font-bold text-slate-900 text-sm shadow-sm">
            ✦
          </div>
          <div>
            <p className="font-serif italic font-bold text-base leading-none text-white">Vacaciones con Clase</p>
            <p className="text-[10px] tracking-widest text-amber-200/80 uppercase font-semibold">PORTAL ASESORES</p>
          </div>
        </div>

        {/* Sección de información inferior */}
        <div className="mt-12 md:mt-0 max-w-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-[1px] bg-[#D4A338]"></span>
            <span className="text-[11px] font-semibold text-[#D4A338] tracking-widest uppercase">CRM INTERNO</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-4 text-white">
            Gestiona tus leads<br />con eficiencia
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mb-6 leading-relaxed">
            Plataforma exclusiva para asesores de Vacaciones con Clase. Visualiza, gestiona y cierra más ventas desde un solo lugar con métricas en tiempo real.
          </p>

          {/* Badges descriptivos */}
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-slate-200">
              Gestión de Leads
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-slate-200">
              Métricas en vivo
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-slate-200">
              WhatsApp integrado
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-slate-200">
              Pipeline de ventas
            </span>
          </div>
        </div>
      </div>

      {/* Columna Derecha - Formulario de inicio de sesión */}
      <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-12 relative">
        {/* Botón Volver al sitio */}
        <button
          onClick={onGoHome}
          className="absolute top-8 left-8 md:left-20 flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          ‹ Volver al sitio
        </button>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-[1px] bg-[#D4A338]"></span>
              <span className="text-[10px] font-bold text-[#D4A338] tracking-widest uppercase">ACCESO SEGURO</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">Bienvenido, asesor</h2>
            <p className="text-xs text-slate-500 mt-1">Ingresa tus credenciales para acceder al CRM.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo electrónico / Usuario
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-[#D4A338] transition-colors shadow-sm"
                placeholder="asesor@vacacionesconclase.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-[#D4A338] transition-colors shadow-sm"
                placeholder="••••••••"
              />
            </div>

            {/* Aviso informativo opcional */}
            <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-[11px] text-amber-800 flex items-center gap-2">
              <span>💡</span>
              <span>Ingresa con tus credenciales asignadas de asesor.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Verificando...' : 'Ingresar al CRM →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}