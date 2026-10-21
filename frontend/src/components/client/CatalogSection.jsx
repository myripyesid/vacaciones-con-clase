import { useState, useEffect, useMemo } from 'react';
import PlanCard from './PlanCard';
import PlanFilters from './PlanFilters';
import useDebounce from '../../hooks/useDebounce';
import { fetchPlanes } from '../../api/planes';

const FILTROS_INICIALES = { destino: '', precioMin: '', precioMax: '', texto: '' };

export default function CatalogSection({ plans, onSelectPlan }) {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true); // Solo cubre la carga inicial del catálogo

  // Espera a que el usuario deje de escribir/ajustar los filtros antes
  // de volver a consultar el backend (evita una petición por cada tecla).
  const filtrosDebounced = useDebounce(filtros, 400);

  // Opciones del selector de destino: se derivan del catálogo completo
  // ya cargado en Home, no de los resultados filtrados.
  const destinos = useMemo(() => {
    const unicos = new Set(plans.map((plan) => plan.destino).filter(Boolean));
    return Array.from(unicos).sort();
  }, [plans]);

  const hasActiveFilters = Object.values(filtros).some((value) => value !== '');

  useEffect(() => {
    let cancelado = false;

    fetchPlanes(filtrosDebounced)
      .then((data) => {
        if (!cancelado) setResultados(data);
      })
      .catch(() => {
        if (!cancelado) setResultados([]);
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [filtrosDebounced]);

  return (
    <section id="catalogo" className="bg-brand-gray-light px-5 pb-20 pt-32 text-brand-gray-dark sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-serif">Catálogo de planes</h2>
        </div>

        <PlanFilters
          destinos={destinos}
          filtros={filtros}
          onChange={setFiltros}
          onClear={() => setFiltros(FILTROS_INICIALES)}
          hasActiveFilters={hasActiveFilters}
        />

        {loading ? (
          <p className="text-center text-sm text-slate-500">Buscando planes...</p>
        ) : resultados.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            No se encontraron planes que coincidan con los criterios seleccionados.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 text-slate-800 md:grid-cols-2 md:gap-8">
            {resultados.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onSelect={onSelectPlan} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
