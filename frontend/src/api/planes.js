const API_URL = 'http://127.0.0.1:8000/api';

export async function fetchPlanes() {
  const response = await fetch(`${API_URL}/planes/`);
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