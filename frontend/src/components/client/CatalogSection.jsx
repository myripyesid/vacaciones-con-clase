import { useState } from 'react';
import PlanCard from './PlanCard';

export default function CatalogSection({ plans, onSelectPlan }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = plans.filter((plan) => {
    const title = (plan.titulo || plan.nombre || plan.title || '').toLowerCase();
    return title.includes(searchQuery.toLowerCase());
  });

  return (
    <section id="catalogo" className="bg-brand-gray-light px-5 pb-20 pt-32 text-brand-gray-dark sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-serif">Catálogo de planes</h2>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <input
            type="text"
            placeholder="Buscar destino o plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-brand-border bg-white px-6 py-3 text-sm text-brand-gray-dark shadow-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 text-slate-800 md:grid-cols-2 md:gap-8">
          {filtered.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={onSelectPlan} />
          ))}
        </div>
      </div>
    </section>
  );
}
