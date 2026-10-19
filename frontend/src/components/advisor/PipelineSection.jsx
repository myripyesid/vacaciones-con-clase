import React from 'react';

export default function PipelineSection({ leads = [] }) {
  const totalLeads = leads.length || 1; // Evita división por cero

  // Definición de las etapas del pipeline asociadas a los estados del backend
  const stages = [
    {
      label: 'Nuevo',
      key: 'NUEVO',
      icon: '🔔',
      color: 'bg-blue-600',
      textColor: 'text-blue-700',
    },
    {
      label: 'Contactado',
      key: 'CONTACTADO',
      icon: '📞',
      color: 'bg-amber-400',
      textColor: 'text-amber-700',
    },
    {
      label: 'En negociación',
      key: 'NEGOCIACION',
      icon: '📄',
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
    },
    {
      label: 'Venta concretada',
      key: 'GANADO',
      icon: '✅',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
    },
    {
      label: 'Oportunidad perdida',
      key: 'PERDIDO',
      icon: '❌',
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-6">
        📈 Pipeline de leads
      </h2>

      <div className="space-y-5">
        {stages.map((stage) => {
          const count = leads.filter((lead) => lead.estado?.toUpperCase() === stage.key).length;
          const percentage = Math.round((count / totalLeads) * 100);

          return (
            <div key={stage.key} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className={stage.textColor}>{stage.icon} {stage.label}</span>
                <span className="text-slate-400">
                  {count} {count === 1 ? 'lead' : 'leads'}
                </span>
              </div>

              {/* Barra de Progreso */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stage.color} transition-all duration-500 rounded-full`}
                  style={{ width: `${count > 0 ? Math.max(percentage, 8) : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
