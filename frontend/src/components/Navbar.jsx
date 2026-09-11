export default function Navbar({ onGoHome, onGoToCatalog }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        
        {/* Logo VCC estilo marca original / cursiva azul */}
        <a 
          href="#inicio" 
          onClick={(e) => { e.preventDefault(); onGoHome?.(); }} 
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <div className="relative flex items-center">
              <span className="font-serif italic font-extrabold text-3xl md:text-4xl text-[#1E3A8A] tracking-tighter leading-none select-none">
                Vcc
              </span>
              {/* Icono de avión flotante sobre la marca */}
              <span className="text-slate-500 text-sm transform rotate-45 -mt-3 ml-0.5">
                ✈
              </span>
            </div>
            <div className="w-full border-t border-[#1E3A8A] my-0.5" />
            <span className="text-[8px] md:text-[9px] font-bold tracking-[0.22em] text-[#1E3A8A] uppercase whitespace-nowrap">
              VACACIONES <span className="font-light text-slate-600">CON</span> CLASE
            </span>
          </div>
        </a>

        {/* Menú de navegación + Botones de acción */}
        <div className="flex items-center gap-6 md:gap-8">
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
            <a 
              href="#inicio" 
              onClick={(e) => { e.preventDefault(); onGoHome?.(); }} 
              className="hover:text-[#1E3A8A] transition-colors cursor-pointer"
            >
              Inicio
            </a>
            <a 
              href="#planes" 
              onClick={(e) => { e.preventDefault(); onGoToCatalog?.(); }} 
              className="hover:text-[#1E3A8A] transition-colors cursor-pointer"
            >
              Planes
            </a>
            <a href="#catalogo" className="hover:text-[#1E3A8A] transition-colors">
              Destinos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Botón Asesores (Outlined / Borde delgado) */}
            <a
              href="#asesores"
              className="border border-slate-300 hover:border-slate-800 text-slate-700 hover:text-slate-900 text-xs font-semibold px-4 py-2.5 rounded-md transition-all duration-200"
            >
              Asesores
            </a>

            {/* Botón Principal "Ver planes ✈" (Dorado redondeado) */}
            <a
              href="#catalogo"
              onClick={(e) => { e.preventDefault(); onGoToCatalog?.(); }}
              className="bg-[#D4A338] hover:bg-[#c3932a] text-slate-950 text-xs font-bold px-5 py-2.5 rounded-full transition-all duration-200 flex items-center gap-2 shadow-sm cursor-pointer"
            >
              Ver planes ✈
            </a>
          </div>
        </div>

      </div>
    </header>
  );
}