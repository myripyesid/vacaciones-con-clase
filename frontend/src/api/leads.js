const API_URL = 'http://127.0.0.1:8000/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  };
}

// HU-15: detalle de un lead asignado al asesor autenticado.
export async function fetchLeadDetail(id) {
  const response = await fetch(`${API_URL}/asesor/leads/${id}/`, {
    headers: authHeaders(),
  });
  if (response.status === 404) {
    throw new Error('Este lead no existe o no está asignado a ti.');
  }
  if (!response.ok) {
    throw new Error(`Error al consultar el lead: ${response.statusText}`);
  }
  return response.json();
}
