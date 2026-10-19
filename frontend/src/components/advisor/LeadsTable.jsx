import React, { useState } from 'react';
import LeadVisualization, { LEAD_ROW_GRID } from './LeadVisualization';
import LeadsFilter from './LeadsFilter';

export default function LeadsTable({ leads = [] }) {
  const [estadoFilter, setEstadoFilter] = useState('TODOS');

  const visibleLeads = estadoFilter === 'TODOS'
    ? leads
    : leads.filter((lead) => lead.estado?.toUpperCase() === estadoFilter);

  return (
    <div>
      <div className="flex justify-end mb-3">
        <LeadsFilter value={estadoFilter} onChange={setEstadoFilter} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className={`${LEAD_ROW_GRID} px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide`}>
          <span>Cliente</span>
          <span>Plan</span>
          <span>Fecha</span>
          <span>Estado</span>
        </div>

        {visibleLeads.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500">
            No se encontraron leads que coincidan con los filtros.
          </div>
        ) : (
          visibleLeads.map((lead) => (
            <LeadVisualization key={lead.id} lead={lead} />
          ))
        )}
      </div>
    </div>
  );
}
