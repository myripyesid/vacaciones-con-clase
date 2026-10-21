import logo from '../../assets/1 Nuevo LOGO FINAL VCC.png';

export default function BrandLogo({ className = '' }) {
  return (
    <img
      src={logo}
      alt="Vacaciones con Clase"
      className={`h-auto object-contain ${className}`}
    />
  );
}
