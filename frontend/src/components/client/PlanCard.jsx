export default function PlanCard({ plan, onSelect, badge, location, destination, image, duration }) {
  const title = plan.titulo || plan.nombre || plan.title || 'Plan sin título';
  const price = plan.precio_referencia;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      
      <div>
        {/* Imagen con badges y ubicación superpuesta */}
        <div className="relative h-56 bg-slate-100 overflow-hidden">
          <img
            src={image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'}
            alt={title}
            className="w-full h-full object-cover"
          />
          
          {/* Sombra gradiente inferior para legibilidad del texto sobre la foto */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Badge superior izquierdo */}
          {badge && (
            <span className="absolute top-4 left-4 bg-[#D4A338] text-slate-950 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
              {badge}
            </span>
          )}

          {/* Texto de ubicación y destino dentro de la imagen */}
          <div className="absolute bottom-3 left-4 text-white">
            <span className="text-[10px] text-slate-300 block leading-tight font-light">
              {location || 'Colombia'}
            </span>
            <span className="text-xs font-bold tracking-wide">
              {destination || title}
            </span>
          </div>
        </div>

        {/* Contenido de la tarjeta */}
        <div className="p-6">
          <h3 className="text-xl font-serif text-slate-900 mb-2 font-normal">
            {title}
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
            {plan.descripcion}
          </p>
        </div>
      </div>

      {/* Pie de la tarjeta con Precio y Botón */}
      <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
            Desde
          </span>
          <span className="text-lg font-bold text-slate-900 block leading-none my-0.5">
            ${Number(price).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] text-slate-400 block">
            por persona · {duration || '4 días / 3 noches'}
          </span>
        </div>

        <button
          onClick={() => onSelect(plan)}
          className="bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
        >
          Ver plan →
        </button>
      </div>

    </div>
  );
}