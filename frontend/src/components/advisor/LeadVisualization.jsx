import React from 'react';

const AVATAR_COLORS = [
  { bg: 'bg-brand-blue-soft', text: 'text-brand-blue' },
  { bg: 'bg-slate-100', text: 'text-slate-700' },
  { bg: 'bg-blue-100', text: 'text-blue-800' },
  { bg: 'bg-slate-200', text: 'text-slate-700' },
  { bg: 'bg-blue-50', text: 'text-brand-blue' },
];

export const ESTADO_CONFIG = {
  NUEVO: { label: 'Nuevo', bg: 'bg-brand-blue-soft', text: 'text-brand-blue', border: 'border-brand-blue/20' },
  CONTACTADO: { label: 'Contactado', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  NEGOCIACION: { label: 'En negociación', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  GANADO: { label: 'Venta realizada', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  PERDIDO: { label: 'Oportunidad perdida', bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
};

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

const formatFecha = (isoDate) => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

export const LEAD_ROW_GRID = 'grid grid-cols-2 items-center gap-x-3 gap-y-3 md:grid-cols-[2.5fr_2fr_1fr_1.3fr] md:gap-x-0';

export default function LeadVisualization({ lead }) {
  const avatarColor = getAvatarColor(lead.cliente_nombre);
  const estadoNormalizado = lead.estado?.toUpperCase();
  const estadoConfig = ESTADO_CONFIG[estadoNormalizado] || {
    label: lead.estado || '—',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
  };

  return (
    <div className={`${LEAD_ROW_GRID} px-4 py-4 border-b border-slate-100 hover:bg-slate-50/60 transition-colors`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 shrink-0 rounded-full ${avatarColor.bg} ${avatarColor.text} font-semibold flex items-center justify-center text-xs`}>
          {getInitials(lead.cliente_nombre)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{lead.cliente_nombre}</p>
          <p className="text-xs text-slate-500 truncate">{lead.cliente_email}</p>
          {lead.cliente_telefono && (
            <p className="text-xs text-slate-500 truncate">{lead.cliente_telefono}</p>
          )}
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{lead.plan_nombre}</p>
        <p className="text-xs text-slate-500 truncate">{lead.plan_destino}</p>
      </div>

      <div className="text-sm text-slate-600">
        {formatFecha(lead.fecha_creacion)}
      </div>

      <div>
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${estadoConfig.bg} ${estadoConfig.text} ${estadoConfig.border}`}>
          {estadoConfig.label}
        </span>
      </div>
    </div>
  );
}
