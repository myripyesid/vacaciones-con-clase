import { useState } from 'react';

export default function Form({ plan, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    numero_viajeros: '',
    fechas_tentativas: '',
    observaciones: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...formData,
      plan_id: plan?.id,
      fechas_tentativas: formData.fechas_tentativas || null,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/leads/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la solicitud. Intenta nuevamente.');
      }

      const data = await response.json();
      if (onSuccess) {
        onSuccess(data);
      } else {
        if (onBack) onBack();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Formateo dinámico del precio
  const formattedPrice = plan?.precio
    ? `$${Number(plan.precio).toLocaleString('es-CO')}`
    : '$1.850.000';

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-[#FAF8F5] flex flex-col items-center">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Tarjeta Resumen del Plan */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={plan?.imagen || plan?.image_url || 'https://images.unsplash.com/photo-1583531172005-814191b8b6c0?auto=format&fit=crop&w=300&q=80'}
              alt={plan?.destino || 'Plan seleccionado'}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">
                {plan?.ubicacion || 'Bolívar, Colombia'}
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {plan?.destino || plan?.titulo || 'Cartagena Mágica'}
              </h3>
              <span className="text-xs text-slate-500 font-light block mt-0.5">
                {plan?.duracion || '4 días / 3 noches'}
              </span>
            </div>
          </div>

          <div className="text-right whitespace-nowrap">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Desde</span>
            <span className="text-lg font-bold text-[#D4A338]">
              {formattedPrice}
            </span>
          </div>
        </div>

        {/* Tarjeta Principal del Formulario */}
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-100">
          
          {/* Encabezado */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-6 h-[1px] bg-[#D4A338]"></span>
              <span className="text-[10px] tracking-[0.2em] text-[#D4A338] font-bold uppercase">
                TU SOLICITUD
              </span>
            </div>
            <h2 className="text-3xl font-serif text-slate-900 font-normal mb-2">
              ¿Nos cuentas más?
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              Completa tus datos y un asesor especializado te contactará en menos de 24 horas con una propuesta personalizada.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            
            {/* Nombre completo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nombre completo <span className="text-[#D4A338]">*</span>
              </label>
              <input
                type="text"
                name="nombre_completo"
                required
                placeholder="Ej. María Fernanda Ospina"
                value={formData.nombre_completo}
                onChange={handleChange}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-[#D4A338] focus:bg-white transition-all"
              />
            </div>

            {/* Correo y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Correo electrónico <span className="text-[#D4A338]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-[#D4A338] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Teléfono / WhatsApp <span className="text-[#D4A338]">*</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  required
                  placeholder="3001234567"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-[#D4A338] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Número de viajeros y Fecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Número de viajeros <span className="text-[#D4A338]">*</span>
                </label>
                <select
                  name="numero_viajeros"
                  required
                  value={formData.numero_viajeros}
                  onChange={handleChange}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-[#D4A338] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="">Seleccionar...</option>
                  <option value="1">1 viajero</option>
                  <option value="2">2 viajeros</option>
                  <option value="3-5">3 - 5 viajeros</option>
                  <option value="6+">6+ viajeros (Grupo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Fecha aproximada <span className="text-[#D4A338]">*</span>
                </label>
                <input
                  type="date"
                  name="fechas_tentativas"
                  required
                  value={formData.fechas_tentativas}
                  onChange={handleChange}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-[#D4A338] focus:bg-white transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Comentarios adicionales */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Comentarios adicionales <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <textarea
                name="observaciones"
                rows="3"
                placeholder="Cuéntanos sobre tu viaje ideal, necesidades especiales, presupuesto disponible, o cualquier detalle importante..."
                value={formData.observaciones}
                onChange={handleChange}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-[#D4A338] focus:bg-white transition-all resize-none"
              ></textarea>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#D4A338] hover:bg-[#c3932a] active:scale-[0.99] text-slate-950 font-bold text-xs py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Enviando...' : '✈ Enviar solicitud'}
            </button>

            <p className="text-[10px] text-slate-400 text-center font-light pt-1">
              Tu información es confidencial y no será compartida con terceros.
            </p>

          </form>
        </div>

      </div>
    </div>
  );
}