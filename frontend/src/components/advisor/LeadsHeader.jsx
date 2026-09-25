import React from 'react';

export default function LeadsHeader({ leads = [] }) {
  const safeLeads = Array.isArray(leads) ? leads : [];
  const totalLeads = safeLeads.length;

  // Conteo de nuevos leads sin atender
  const nuevosLeads = safeLeads.filter(
    (l) => l.estado?.toUpperCase() === 'NUEVO'
  ).length;

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-slate-900 font-serif tracking-tight">
        Leads
      </h1>
      <p className="text-xs text-slate-500 mt-1 font-medium">
        {totalLeads} {totalLeads === 1 ? 'lead' : 'leads'} en total
        {nuevosLeads > 0 && ` · ${nuevosLeads} nuevos sin atender`}
      </p>
    </div>
  );
}