import { useState } from 'react';
import Form from './Form';

export default function PlanDetail({ plan, onBack }) {
  // Estado para controlar la visualización del formulario
  const [showForm, setShowForm] = useState(false);

  // Manejo de la galería de imágenes
  const defaultImages = [
    plan?.imagen || plan?.image_url || 'https://images.unsplash.com/photo-1583531172005-814191b8b6c0?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=600&auto=format&fit=crop',
  ];

  const images = plan?.galeria || defaultImages;
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const price = plan?.precio_referencia;
  const title = plan?.titulo;
  const location = plan?.destino;
  const incluye = plan?.incluye;
  const listaIncluye = incluye ? incluye.split(',').map(item => item.trim()) : [];

  // Si el usuario hace clic en "Me interesa este plan", mostramos el formulario
  if (showForm) {
    return (
      <Form
        plan={plan}
        onBack={() => setShowForm(false)}
        onSuccess={() => {
          setShowForm(false);
        }}
      />
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Botón Volver */}
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          ← Volver a los planes
        </button>

        {/* Layout Principal: 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* COLUMNA IZQUIERDA (Galería + Detalles) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Imagen Principal con Badge */}
            <div className="relative rounded-2xl overflow-hidden shadow-md bg-slate-200 h-[360px] md:h-[420px]">
              <img
                src={selectedImage}
                alt={title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <span className="absolute top-4 left-4 bg-[#D4A338] text-slate-950 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                {plan?.badge || 'Más vendido'}
              </span>
            </div>

            {/* Miniaturas de la Galería */}
            <div className="flex items-center gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-[#D4A338] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Título y Descripción */}
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#D4A338] font-semibold block mb-1">
                {location}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4 font-normal">
                {title}
              </h1>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light">
                {plan?.descripcion ||
                  'Sumérgete en la magia de Cartagena de Indias, la joya del Caribe colombiano. Recorre sus calles empedradas, admira su arquitectura colonial perfectamente conservada y disfruta de atardeceres únicos sobre las murallas históricas.'}
              </p>
            </div>

            {/* Experiencias Incluidas */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Experiencias incluidas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Ciudad Amurallada Patrimonio UNESCO',
                  'Islas del Rosario en lancha privada',
                  'Atardecer sobre las murallas coloniales',
                  'Gastronomía caribeña auténtica',
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F3EFEA] rounded-lg p-3.5 flex items-center gap-3 text-xs text-slate-800 font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#D4A338] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Listas: El Plan Incluye / No Incluye */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-slate-200/80">
              
              {/* Incluye */}
              <div>
                <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  ✓ EL PLAN INCLUYE
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 font-light">
                  {listaIncluye.length > 0 ? (
                    listaIncluye.map((item, index) => (
                      <li key={index}>• {item.trim()}</li>
                    ))
                  ) : (
                    <li>• No hay especificaciones disponibles</li>
                  )}
                </ul>
              </div>

              {/* No Incluye */}
              <div>
                <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  ✕ NO INCLUYE
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 font-light">
                  <li>• Almuerzos y cenas</li>
                  <li>• Gastos personales</li>
                  <li>• Propinas</li>
                  <li>• Actividades opcionales</li>
                </ul>
              </div>

            </div>

          </div>

          {/* COLUMNA DERECHA (Card Flotante de Reserva / Precio) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xl space-y-6">
              
              <div>
                <span className="bg-[#D4A338] text-slate-950 text-[10px] font-bold px-3 py-1 rounded-full inline-block mb-3">
                  {plan?.badge || 'Más vendido'}
                </span>
                <h2 className="text-xl font-serif text-slate-900 font-normal">
                  {title}
                </h2>
                <span className="text-xs text-slate-400 block">{location}</span>
              </div>

              {/* Tabla resumen de detalles */}
              <div className="space-y-2.5 text-xs border-t border-b border-slate-100 py-4">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Duración</span>
                  <span className="font-semibold text-slate-900">{plan?.duracion || '4 días / 3 noches'}</span>
                </div>
                <div className="flex justify-[#between] items-center text-slate-600">
                  <span>Tiquetes</span>
                  <span className="text-slate-700">Incluidos</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Alojamiento</span>
                  <span className="text-slate-700">Incluido</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Seguro de viaje</span>
                  <span className="text-emerald-600 font-medium">✓ Incluido</span>
                </div>
              </div>

              {/* Precio */}
              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                  Precio desde
                </span>
                <span className="text-3xl font-bold text-slate-900 block my-1">
                  ${Number(price).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-slate-400">por persona · IVA incluido</span>
              </div>

              {/* Botón de Acción Principal */}
              <button 
                onClick={() => setShowForm(true)}
                className="w-full bg-[#D4A338] hover:bg-[#c3932a] text-slate-950 text-xs font-bold py-3.5 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>✈</span> Me interesa este plan
              </button>

              <p className="text-[10px] text-slate-400 text-center leading-tight">
                Sin compromiso. Un asesor se comunicará contigo en menos de 24 horas.
              </p>

              {/* Badges de Garantía Inferiores */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
                <div className="space-y-1">
                  <span className="text-emerald-600 text-xs block">🛡</span>
                  <span className="text-[9px] text-slate-500 block leading-none">Seguro</span>
                </div>
                <div className="space-y-1">
                  <span className="text-emerald-600 text-xs block">✈</span>
                  <span className="text-[9px] text-slate-500 block leading-none">Vuelos directos</span>
                </div>
                <div className="space-y-1">
                  <span className="text-emerald-600 text-xs block">🏨</span>
                  <span className="text-[9px] text-slate-500 block leading-none">Hoteles 4-5★</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}