import React from 'react';
import { ESTADO_CONFIG } from './LeadVisualization';

export default function LeadsFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2.5 text-sm bg-white border border-brand-border rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors cursor-pointer"
    >
      <option value="TODOS">Todos los estados</option>
      {Object.entries(ESTADO_CONFIG).map(([estadoValue, config]) => (
        <option key={estadoValue} value={estadoValue}>
          {config.label}
        </option>
      ))}
    </select>
  );
}
