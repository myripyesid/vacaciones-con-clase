import React from 'react';

export default function RecentActivity({ leads = [] }) {
  // Configuración de Badges por Estado
  const statusBadges = {
    NUEVO: { label: 'Nuevo', style: 'bg-blue-50 text-blue-600 border-blue-200' },
    EN_CONTACTO: { label: 'Contactado', style: 'bg-amber-50 text-amber-600 border-amber-200' },
    COTIZACION_ENVIADA: { label: 'Cotización enviada', style: 'bg-purple-50 text-purple-600 border-purple-200' },
    NEGOCIACION: { label: 'Negociación', style: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    VENTA_REALIZADA: { label: 'Venta realizada', style: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
    OPORTUNIDAD_PERDIDA: { label: 'Oportunidad perdida', style: 'bg-rose-50 text-rose-600 border-rose-200' },
  };

  // Función para obtener iniciales del cliente
  const getInitials = (name) => {
    if (!name) return 'C';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Ordenar por fecha descendente y tomar los últimos 5
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
    .slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-bold text-slate-900">Actividad reciente</h2>
        <a href="#leads" className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors">
          Ver todos →
        </a>
      </div>

      <div className="space-y-4">
        {recentLeads.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No hay actividad reciente.</p>
        ) : (
          recentLeads.map((lead) => {
            const badge = statusBadges[lead.estado] || statusBadges.NUEVO;

            return (
              <div key={lead.id} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                    {getInitials(lead.cliente_nombre)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {lead.cliente_nombre}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {lead.plan_nombre}
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${badge.style} shrink-0`}>
                  {badge.label}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}