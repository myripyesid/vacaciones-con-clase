import BrandLogo from '../common/BrandLogo';

export default function Navbar({ onGoHome, onGoToCatalog, onGoToLogin }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-brand-border bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-12">
        <a
          href="#inicio"
          onClick={(event) => { event.preventDefault(); onGoHome?.(); }}
          className="flex shrink-0 items-center"
          aria-label="Vacaciones con Clase, inicio"
        >
          <BrandLogo className="max-h-14 w-32 sm:w-36 md:w-44" />
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium text-brand-gray-dark md:flex lg:gap-8">
          <a href="#inicio" onClick={(event) => { event.preventDefault(); onGoHome?.(); }} className="transition-colors hover:text-brand-blue">Inicio</a>
          <a href="#planes" onClick={(event) => { event.preventDefault(); onGoToCatalog?.(); }} className="transition-colors hover:text-brand-blue">Planes</a>
          <a href="#catalogo" onClick={(event) => { event.preventDefault(); onGoToCatalog?.(); }} className="transition-colors hover:text-brand-blue">Destinos</a>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href="#login"
            onClick={(event) => { event.preventDefault(); onGoToLogin?.(); }}
            className="cursor-pointer rounded-lg border border-brand-border px-3 py-2.5 text-xs font-semibold text-brand-blue transition-colors hover:border-brand-blue hover:bg-brand-blue-soft sm:px-4"
          >
            Asesores
          </a>
          <a
            href="#catalogo"
            onClick={(event) => { event.preventDefault(); onGoToCatalog?.(); }}
            className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-brand-blue px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-blue-hover sm:px-5"
          >
            Ver planes
          </a>
        </div>
      </div>
    </header>
  );
}
