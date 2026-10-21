const API_URL = 'http://127.0.0.1:8000/api';

export async function fetchPlanes(filtros = {}) {
  const params = new URLSearchParams();

  if (filtros.destino) params.set('destino', filtros.destino);
  if (filtros.precioMin) params.set('precio_min', filtros.precioMin);
  if (filtros.precioMax) params.set('precio_max', filtros.precioMax);
  if (filtros.texto) params.set('q', filtros.texto);

  const query = params.toString();
  const url = query ? `${API_URL}/planes/?${query}` : `${API_URL}/planes/`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Error al obtener los planes');
  return response.json();
}

export async function submitSolicitud(payload) {
  const response = await fetch(`${API_URL}/solicitudes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Error al enviar la solicitud');
  return response.json();
}