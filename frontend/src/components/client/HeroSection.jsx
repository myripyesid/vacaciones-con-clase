export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 px-6 md:px-16 overflow-hidden">
      {/* Imagen de fondo con overlay oscuro */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1583531172005-814191b8b6c0?q=80&w=1920&auto=format&fit=crop')`,
        }}
      >
        {/* Capa de sombra/overlay para oscurecer la imagen de fondo */}
        <div className="absolute inset-0 bg-slate-950/70 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40" />
      </div>

      {/* Contenido principal alineado a la izquierda */}
      <div className="relative z-10 max-w-2xl text-white my-auto">
        {/* Etiqueta superior */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-[1px] bg-[#CA8A04]"></span>
          <span className="text-xs tracking-[0.2em] text-[#CA8A04] font-semibold uppercase">
            Agencia de viajes certificada
          </span>
        </div>

        {/* Título principal */}
        <h1 className="text-5xl md:text-6xl font-serif leading-[1.15] mb-6 font-normal">
          Viaja con <span className="text-[#CA8A04] italic font-serif">estilo</span> <br />
          y con clase
        </h1>

        {/* Subtítulo/Descripción */}
        <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 max-w-lg font-light">
          Convertimos tus viajes en experiencias inolvidables. Cuidamos cada detalle para que solo te preocupes por disfrutar.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-wrap items-center gap-4 mb-16">
          <a
            href="#catalogo"
            className="bg-[#CA8A04] hover:bg-[#b57a03] text-slate-950 text-xs font-bold px-6 py-3.5 rounded-full transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            Ver planes ✈
          </a>
          <a
            href="#destinos"
            className="border border-slate-500/60 hover:border-white text-white text-xs font-semibold px-6 py-3.5 rounded-full transition-all duration-200 bg-slate-900/30 backdrop-blur-sm"
          >
            Conocer destinos
          </a>
        </div>

        {/* Métricas / Estadísticas */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-700/50 max-w-md">
          <div>
            <span className="text-2xl font-bold text-white block">+500</span>
            <span className="text-xs text-slate-400">Viajeros felices</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-white block">4★</span>
            <span className="text-xs text-slate-400">Hoteles seleccionados</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-white block">10+</span>
            <span className="text-xs text-slate-400">Años de experiencia</span>
          </div>
        </div>
      </div>
    </section>
  );
}