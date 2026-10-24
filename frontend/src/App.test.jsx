import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('Cierre de sesión del asesor', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'asesor-token');
    localStorage.setItem('user', JSON.stringify({ name: 'Ana Asesora', role: 'Asesora' }));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
  });

  it('elimina la sesión y vuelve a mostrar la web pública', async () => {
    const user = userEvent.setup();
    render(<App />);

    const logout = await screen.findByRole('button', { name: /cerrar sesión/i });
    await user.click(logout);

    expect(await screen.findByRole('link', { name: 'Vacaciones con Clase, inicio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Asesores' })).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
