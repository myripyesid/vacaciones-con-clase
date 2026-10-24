import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LeadsBoard from './LeadsBoard';

const leads = [
  {
    id: 1,
    cliente_nombre: 'Ana Pérez',
    cliente_email: 'ana@example.com',
    cliente_telefono: '3001234567',
    plan_nombre: 'Cartagena Mágica',
    plan_destino: 'Cartagena',
    fecha_creacion: '2026-01-15T10:00:00Z',
    estado: 'NUEVO',
  },
  {
    id: 2,
    cliente_nombre: 'Luis Díaz',
    cliente_email: 'luis@example.com',
    cliente_telefono: '3109876543',
    plan_nombre: 'San Andrés',
    plan_destino: 'San Andrés',
    fecha_creacion: '2026-02-15T10:00:00Z',
    estado: 'GANADO',
  },
];

describe('Panel de leads', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'asesor-token');
    vi.stubGlobal('fetch', vi.fn());
  });

  it('carga leads autenticados y busca por correo, teléfono y plan', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ results: leads }) });
    const user = userEvent.setup();
    render(<LeadsBoard onLogout={vi.fn()} currentView="leads" onNavigate={vi.fn()} />);

    expect(await screen.findByText('Ana Pérez')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/asesor/leads/', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Token asesor-token' }),
    }));

    const search = screen.getByPlaceholderText(/buscar por nombre, correo, teléfono o plan/i);
    await user.type(search, 'ana@example.com');
    await waitFor(() => expect(screen.queryByText('Luis Díaz')).not.toBeInTheDocument(), { timeout: 1500 });
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, '3109876543');
    await waitFor(() => expect(screen.queryByText('Ana Pérez')).not.toBeInTheDocument(), { timeout: 1500 });
    expect(screen.getByText('Luis Díaz')).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'cartagena mágica');
    await waitFor(() => expect(screen.queryByText('Luis Díaz')).not.toBeInTheDocument(), { timeout: 1500 });
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
  });

  it('presenta el error de carga devuelto por el servidor', async () => {
    fetch.mockResolvedValue({ ok: false, statusText: 'Unauthorized' });
    render(<LeadsBoard onLogout={vi.fn()} currentView="leads" onNavigate={vi.fn()} />);
    expect(await screen.findByText('Error en la petición: Unauthorized')).toBeInTheDocument();
  });

  it('presenta una lista vacía cuando el servidor no asignó leads', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] });
    render(<LeadsBoard onLogout={vi.fn()} currentView="leads" onNavigate={vi.fn()} />);
    expect(await screen.findByText('No se encontraron leads que coincidan con los filtros.')).toBeInTheDocument();
  });

  it('muestra el estado de carga mientras espera la respuesta de leads', () => {
    fetch.mockReturnValue(new Promise(() => {}));
    render(<LeadsBoard onLogout={vi.fn()} currentView="leads" onNavigate={vi.fn()} />);
    expect(screen.getByText('Cargando tus leads...')).toBeInTheDocument();
  });
});
