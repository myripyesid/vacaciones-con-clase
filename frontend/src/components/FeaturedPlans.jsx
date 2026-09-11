import PlanCard from './PlanCard';

export default function FeaturedPlans({ plans, loading, onSelectPlan, onGoToCatalog }) {
  return (
    <section id="planes" className="py-20 px-6 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="w-8 h-[1px] bg-[#D4A338]"></span>
            <span className="text-[11px] tracking-[0.25em] text-[#D4A338] font-semibold uppercase">
              DESTINOS DESTACADOS
            </span>
            <span className="w-8 h-[1px] bg-[#D4A338]"></span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif text-[#0F172A] mb-3 font-normal">
            Planes que enamoran
          </h2>
          
          <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            Cada destino, cuidadosamente seleccionado para ofrecerte una experiencia única e irrepetible.
          </p>
        </div>

        {/* Renderizado Dinámico de Planes */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Cargando destinos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.slice(0, 3).map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSelect={onSelectPlan}
                // Si la API trae campo imagen, lo usa; si no, coloca una imagen por defecto
                image={plan.imagen || plan.image_url || plan.image}
                badge={plan.destacado ? "Destacado" : null}
                location={plan.ubicacion || plan.ciudad || "Colombia"}
                destination={plan.destino || plan.titulo || plan.nombre}
                duration={plan.duracion || "4 días / 3 noches"}
              />
            ))}
          </div>
        )}

        {/* Botón Ver todos los planes */}
        <div className="text-center">
          <a
            href="#catalogo"
            onClick={(e) => { e.preventDefault(); onGoToCatalog?.(); }}
            className="inline-flex items-center gap-2 border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-200 text-xs font-semibold px-8 py-3 rounded-full cursor-pointer"
          >
            Ver todos los planes →
          </a>
        </div>

      </div>
    </section>
  );
}