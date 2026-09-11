import { useState } from 'react';
import PlanCard from './PlanCard';

export default function CatalogSection({ plans, onSelectPlan }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = plans.filter((plan) => {
    const title = (plan.titulo || plan.nombre || plan.title || '').toLowerCase();
    return title.includes(searchQuery.toLowerCase());
  });

  return (
    <section id="catalogo" className="pt-32 pb-20 px-6 bg-[#0F172A] text-white">
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
            className="w-full bg-slate-900 border border-slate-700 rounded-full py-3 px-6 text-sm text-white focus:outline-none focus:border-[#CA8A04]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-800">
          {filtered.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={onSelectPlan} />
          ))}
        </div>
      </div>
    </section>
  );
}