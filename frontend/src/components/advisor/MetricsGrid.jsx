import React from 'react';

export default function MetricsGrid({ leads = [] }) {
  // 1. Filtrado y conteo dinámico basado en los datos devueltos por el backend
  const nuevos = leads.filter((l) => l.estado === 'NUEVO').length;
  const enContacto = leads.filter((l) => l.estado === 'CONTACTADO').length;
  const cotizaciones = leads.filter((l) => l.estado === 'NEGOCIACION').length;
  const ventas = leads.filter((l) => l.estado === 'GANADO').length;
  const perdidas = leads.filter((l) => l.estado === 'PERDIDO').length;

  // 2. Suma del presupuesto de las ventas cerradas
  const ingresosTotales = leads
    .filter((l) => l.estado === 'GANADO' && l.presupuesto)
    .reduce((sum, l) => sum + Number(l.presupuesto), 0);

  // Formateador de moneda (ej: $2.2M o $2.200.000)
  const formatCurrency = (val) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(1)}M`;
    }
    return `$${val.toLocaleString('es-CO')}`;
  };

  // Configuración de visualización para las 6 tarjetas
  const cards = [
    {
      title: 'Nuevos leads',
      value: nuevos,
      icon: '🔔',
      bgColor: 'bg-blue-50/60',
      borderColor: 'border-blue-100',
      valueColor: 'text-blue-600',
    },
    {
      title: 'En contacto',
      value: enContacto,
      icon: '📞',
      bgColor: 'bg-amber-50/60',
      borderColor: 'border-amber-100',
      valueColor: 'text-amber-600',
    },
    {
      title: 'Cotizaciones',
      value: cotizaciones,
      icon: '📄',
      bgColor: 'bg-purple-50/60',
      borderColor: 'border-purple-100',
      valueColor: 'text-purple-600',
    },
    {
      title: 'Ventas',
      value: ventas,
      icon: '✅',
      bgColor: 'bg-emerald-50/60',
      borderColor: 'border-emerald-100',
      valueColor: 'text-emerald-600',
    },
    {
      title: 'Oport. perdidas',
      value: perdidas,
      icon: '❌',
      bgColor: 'bg-rose-50/60',
      borderColor: 'border-rose-100',
      valueColor: 'text-rose-600',
    },
    {
      title: 'Ingresos totales',
      value: formatCurrency(ingresosTotales),
      icon: '💰',
      bgColor: 'bg-orange-50/40',
      borderColor: 'border-orange-100',
      valueColor: 'text-orange-950',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`p-5 rounded-2xl border ${card.bgColor} ${card.borderColor} flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="text-xl mb-3">{card.icon}</div>
          <div>
            <span className={`text-2xl font-bold ${card.valueColor} block`}>
              {card.value}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {card.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}