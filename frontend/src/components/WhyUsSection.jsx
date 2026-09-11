export default function WhyUsSection() {
  const features = [
    {
      title: 'Seguridad Garantizada',
      description:
        'Todos nuestros planes incluyen seguro de viaje completo y asistencia 24/7 durante tu estadía.',
      icon: (
        <svg className="w-6 h-6 text-[#D4A338]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Vuelos Seleccionados',
      description:
        'Tiquetes aéreos en aerolíneas certificadas con los mejores horarios y conexiones.',
      icon: (
        <svg className="w-6 h-6 text-[#D4A338]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
    },
    {
      title: 'Hoteles 4 y 5 Estrellas',
      description:
        'Alojamiento cuidadosamente seleccionado para garantizar tu comodidad y descanso total.',
      icon: (
        <svg className="w-6 h-6 text-[#D4A338]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      title: 'Asesoría Personalizada',
      description:
        'Un asesor experto te acompaña desde la elección del plan hasta tu regreso a casa.',
      icon: (
        <svg className="w-6 h-6 text-[#D4A338]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#0B1320] text-white">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="w-8 h-[1px] bg-[#D4A338]"></span>
            <span className="text-[10px] tracking-[0.25em] text-[#D4A338] font-semibold uppercase">
              ¿POR QUÉ ELEGIRNOS?
            </span>
            <span className="w-8 h-[1px] bg-[#D4A338]"></span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif text-white font-normal">
            Viajar con clase es diferente
          </h2>
        </div>

        {/* Rejilla de 4 tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-[#0F1829]/60 border border-slate-800/80 rounded-2xl p-8 text-center flex flex-col items-center hover:border-slate-700/80 transition-all duration-300"
            >
              <div className="mb-6 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}