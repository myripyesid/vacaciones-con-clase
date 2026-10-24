import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Login from './Login';

describe('Inicio de sesión de asesores', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('rechaza credenciales inválidas mostrando el mensaje y manteniendo el acceso', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ non_field_errors: ['Credenciales inválidas'] }),
    });
    render(<Login onLoginSuccess={vi.fn()} onGoHome={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('asesor@vacacionesconclase.com'), {
      target: { value: 'asesor' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'incorrecta' } });
    fireEvent.click(screen.getByRole('button', { name: /ingresar al crm/i }));

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar al crm/i })).toBeEnabled();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('guarda token y usuario y notifica al contenedor al autenticar', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'abc-123', user_name: 'María López', role: 'Asesora' }),
    });
    const onLoginSuccess = vi.fn();
    render(<Login onLoginSuccess={onLoginSuccess} onGoHome={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('asesor@vacacionesconclase.com'), {
      target: { value: 'maria' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'secreta' } });
    fireEvent.click(screen.getByRole('button', { name: /ingresar al crm/i }));

    expect(await screen.findByRole('button', { name: /ingresar al crm/i })).toBeEnabled();
    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/login/', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ username: 'maria', password: 'secreta' }),
    }));
    expect(localStorage.getItem('token')).toBe('abc-123');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ name: 'María López', role: 'Asesora' });
    expect(onLoginSuccess).toHaveBeenCalledWith('abc-123');
  });
});
