import React, { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';

export default function LeadsSearchBar({ onSearch }) {
  // Texto "en vivo": se actualiza en cada tecla, controla el <input>.
  const [inputText, setInputText] = useState('');

  // Versión "retrasada" del texto: solo cambia 300ms después de que
  // el usuario deja de escribir.
  const debouncedText = useDebounce(inputText, 300);

  // Cada vez que el valor debounced cambie, notificamos al padre (LeadsBoard)
  // para que haga el filtrado real sobre el arreglo de leads.
  useEffect(() => {
    if (typeof onSearch === 'function') {
      onSearch(debouncedText);
    }
  }, [debouncedText, onSearch]);

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div className="relative flex-1">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        🔍
      </span>
      <input
        type="text"
        value={inputText}
        onChange={handleChange}
        placeholder="Buscar por nombre, correo, teléfono o plan..."
        className="w-full pl-11 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-colors"
      />
    </div>
  );
}