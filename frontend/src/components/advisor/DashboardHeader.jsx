import React from 'react';

export default function DashboardHeader() {
  // Formatear la fecha actual en español (ej: "viernes, 18 de septiembre")
  const formattedDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <header className="mb-6">
      <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
        Dashboard
      </h1>
      <p className="text-sm text-slate-500 capitalize mt-1">
        Resumen de tu actividad — {formattedDate}
      </p>
    </header>
  );
}