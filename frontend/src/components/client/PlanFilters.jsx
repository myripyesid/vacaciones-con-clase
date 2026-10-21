export default function PlanFilters({ destinos, filtros, onChange, onClear, hasActiveFilters }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filtros, [name]: value });
  };

  return (
    <div className="max-w-4xl mx-auto mb-10 bg-white rounded-2xl border border-brand-border shadow-sm p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-brand-gray-dark mb-1.5">
            Destino
          </label>
          <select
            name="destino"
            value={filtros.destino}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm text-brand-gray-dark focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15"
          >
            <option value="">Todos los destinos</option>
            {destinos.map((destino) => (
              <option key={destino} value={destino}>
                {destino}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-gray-dark mb-1.5">
            Precio mínimo
          </label>
          <input
            type="number"
            name="precioMin"
            min="0"
            placeholder="$ 0"
            value={filtros.precioMin}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm text-brand-gray-dark focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-gray-dark mb-1.5">
            Precio máximo
          </label>
          <input
            type="number"
            name="precioMax"
            min="0"
            placeholder="Sin límite"
            value={filtros.precioMax}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm text-brand-gray-dark focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-gray-dark mb-1.5">
            Buscar
          </label>
          <input
            type="text"
            name="texto"
            placeholder="Destino o plan..."
            value={filtros.texto}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm text-brand-gray-dark focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors"
          >
            ✕ Quitar filtros
          </button>
        </div>
      )}
    </div>
  );
}
