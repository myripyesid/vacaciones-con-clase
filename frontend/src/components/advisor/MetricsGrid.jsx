import React from 'react';

export default function MetricsGrid({ leads = [] }) {
  const nuevos = leads.filter((lead) => lead.estado === 'NUEVO').length;
  const enContacto = leads.filter((lead) => lead.estado === 'CONTACTADO').length;
  const cotizaciones = leads.filter((lead) => lead.estado === 'NEGOCIACION').length;
  const ventas = leads.filter((lead) => lead.estado === 'GANADO').length;
  const perdidas = leads.filter((lead) => lead.estado === 'PERDIDO').length;

  const ingresosTotales = leads
    .filter((lead) => lead.estado === 'GANADO' && lead.presupuesto)
    .reduce((sum, lead) => sum + Number(lead.presupuesto), 0);

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    return `$${value.toLocaleString('es-CO')}`;
  };

  const cards = [
    { title: 'Nuevos leads', value: nuevos, icon: '🔔', tone: 'blue' },
    { title: 'En contacto', value: enContacto, icon: '📞', tone: 'amber' },
    { title: 'Cotizaciones', value: cotizaciones, icon: '📄', tone: 'purple' },
    { title: 'Ventas', value: ventas, icon: '✅', tone: 'green' },
    { title: 'Oport. perdidas', value: perdidas, icon: '❌', tone: 'red' },
    { title: 'Ingresos totales', value: formatCurrency(ingresosTotales), icon: '💰', tone: 'gray' },
  ];

  const tones = {
    blue: 'border-blue-100 bg-blue-50/60 text-blue-700',
    amber: 'border-amber-100 bg-amber-50/70 text-amber-700',
    purple: 'border-purple-100 bg-purple-50/70 text-purple-700',
    green: 'border-emerald-100 bg-emerald-50/70 text-emerald-700',
    red: 'border-rose-100 bg-rose-50/70 text-rose-700',
    gray: 'border-brand-border bg-white text-brand-blue',
  };

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md ${tones[card.tone]}`}
        >
          <span aria-hidden="true" className="mb-3 text-xl">{card.icon}</span>
          <div>
            <span className="block text-2xl font-bold">{card.value}</span>
            <span className="text-xs font-medium text-brand-gray">{card.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
