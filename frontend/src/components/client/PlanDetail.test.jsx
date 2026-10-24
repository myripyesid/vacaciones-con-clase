import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PlanDetail from './PlanDetail';

const plan = {
  id: 7,
  titulo: 'Cartagena Mágica',
  destino: 'Cartagena',
  precio_referencia: 1850000,
  incluye: 'Vuelos,Hotel,Seguro',
  galeria: ['https://example.test/cartagena.jpg'],
};

describe('Detalle de plan y solicitud', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 99 }),
    }));
  });

  it('muestra el detalle, abre el formulario y envía los datos requeridos del plan', async () => {
    const user = userEvent.setup();
    const { container } = render(<PlanDetail plan={plan} onBack={vi.fn()} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Cartagena Mágica' })).toBeInTheDocument();
    expect(container.textContent).toContain('• Vuelos');

    fireEvent.click(screen.getByRole('button', { name: /me interesa este plan/i }));
    const name = screen.getByPlaceholderText(/maría fernanda ospina/i);
    const email = screen.getByPlaceholderText('correo@ejemplo.com');
    const phone = screen.getByPlaceholderText('3001234567');
    const travelers = container.querySelector('[name="numero_viajeros"]');
    const date = container.querySelector('[name="fechas_tentativas"]');
    expect(name).toBeRequired();
    expect(email).toBeRequired();
    expect(phone).toBeRequired();
    expect(travelers).toBeRequired();
    expect(date).toBeRequired();
    expect(container.querySelector('form').checkValidity()).toBe(false);

    fireEvent.change(name, { target: { value: 'Ana Pérez' } });
    fireEvent.change(email, { target: { value: 'ana@example.com' } });
    fireEvent.change(phone, { target: { value: '3001234567' } });
    fireEvent.change(travelers, { target: { value: '2' } });
    fireEvent.change(date, { target: { value: '2027-06-10' } });
    await user.click(screen.getByRole('button', { name: /enviar solicitud/i }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Cartagena Mágica' })).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/leads/', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(expect.objectContaining({
      nombre_completo: 'Ana Pérez',
      email: 'ana@example.com',
      telefono: '3001234567',
      numero_viajeros: '2',
      fechas_tentativas: '2027-06-10',
      plan_id: 7,
    }));
  });

  it('muestra el error del servidor y conserva el formulario para reintentar', async () => {
    const user = userEvent.setup();
    const { container } = render(<PlanDetail plan={plan} onBack={vi.fn()} />);
    fetch.mockResolvedValueOnce({ ok: false });
    fireEvent.click(screen.getByRole('button', { name: /me interesa este plan/i }));

    const name = screen.getByPlaceholderText(/maría fernanda ospina/i);
    const email = screen.getByPlaceholderText('correo@ejemplo.com');
    const phone = screen.getByPlaceholderText('3001234567');
    const travelers = container.querySelector('[name="numero_viajeros"]');
    const date = container.querySelector('[name="fechas_tentativas"]');
    fireEvent.change(name, { target: { value: 'Ana Pérez' } });
    fireEvent.change(email, { target: { value: 'ana@example.com' } });
    fireEvent.change(phone, { target: { value: '3001234567' } });
    fireEvent.change(travelers, { target: { value: '2' } });
    fireEvent.change(date, { target: { value: '2027-06-10' } });
    await user.click(screen.getByRole('button', { name: /enviar solicitud/i }));

    expect(await screen.findByText('Error al enviar la solicitud. Intenta nuevamente.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/maría fernanda ospina/i)).toHaveValue('Ana Pérez');
  });
});
