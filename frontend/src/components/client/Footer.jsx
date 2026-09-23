export default function Footer() {
  return (
    <footer className="bg-[#0B1320] text-slate-300 pt-16 pb-8 border-t border-slate-800/60">
      <div className="max-w-6xl mx-auto px-6">
        {/* Contenido principal en 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">
          
          {/* Columna 1: Branding, Descripción y Redes Sociales */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4A338] flex items-center justify-center text-slate-950 font-bold text-lg shadow-md">
                ✈
              </div>
              <div>
                <span className="text-xl font-serif text-white block leading-none">
                  Vacaciones
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#D4A338] font-semibold">
                  CON CLASE
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light max-w-sm">
              Convertimos tus viajes en experiencias inolvidables. Cuidamos cada detalle para que solo te preocupes por disfrutar.
            </p>

            {/* Badges circulares de Redes Sociales */}
            <div className="flex items-center gap-2 pt-2">
              {['IG', 'TK', 'YT', 'LI'].map((social) => (
                <a
                  key={social}
                  href={`#${social.toLowerCase()}`}
                  className="w-8 h-8 rounded-full border border-slate-700/80 hover:border-[#D4A338] hover:text-[#D4A338] text-[10px] font-bold text-slate-400 flex items-center justify-center transition-all duration-200"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Destinos */}
          <div className="space-y-4">
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-[#D4A338] font-semibold">
              DESTINOS
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-light">
              <li>
                <a href="#cartagena" className="hover:text-white transition-colors">
                  Cartagena de Indias
                </a>
              </li>
              <li>
                <a href="#san-andres" className="hover:text-white transition-colors">
                  San Andrés Isla
                </a>
              </li>
              <li>
                <a href="#santa-marta" className="hover:text-white transition-colors">
                  Santa Marta
                </a>
              </li>
              <li>
                <a href="#coveñas" className="hover:text-white transition-colors">
                  Coveñas
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div className="space-y-4">
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-[#D4A338] font-semibold">
              CONTACTO
            </h4>
            <ul className="space-y-3 text-xs text-slate-300 font-light">
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#D4A338] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+57 300 123 4567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#D4A338] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@vacacionesconclase.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#D4A338] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Bogotá, Colombia</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Línea inferior de derechos reservados y lema */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 Vacaciones con Clase. Todos los derechos reservados.</p>
          <span className="flex items-center gap-1 text-slate-400 font-light">
            Cuidamos cada detalle de tu viaje ✈
          </span>
        </div>
      </div>
    </footer>
  );
}