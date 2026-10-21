import { useState, useEffect } from 'react';

/**
 * useDebounce
 *
 * Devuelve una versión "retrasada" del valor recibido: solo se actualiza
 * después de que `delay` milisegundos hayan pasado sin que `value` cambie.
 *
 * Útil para inputs de búsqueda: evita ejecutar el filtrado (o una llamada
 * a la API) en cada tecla presionada, esperando a que el usuario deje de escribir.
 *
 * @param {*} value - El valor que cambia rápido (ej. el texto de un input).
 * @param {number} delay - Milisegundos de espera antes de actualizar el valor devuelto.
 * @returns El valor "debounced", que se actualiza `delay` ms después del último cambio.
 */
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Programa la actualización para dentro de `delay` ms
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Si `value` cambia antes de que se cumpla el `delay`
    // (el usuario sigue escribiendo), cancelamos el timeout anterior.
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}