import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CatalogSection from './CatalogSection';

const plans = [
  { id: 1, titulo: 'Cartagena Mágica', descripcion: 'Playas y ciudad', precio_referencia: 1800000 },
  { id: 2, titulo: 'San Andrés', descripcion: 'Mar de siete colores', precio_referencia: 2200000 },
];

describe('Catálogo de planes', () => {
  it('filtra las tarjetas por destino y permite abrir el plan elegido', () => {
    const onSelectPlan = vi.fn();
    render(<CatalogSection plans={plans} onSelectPlan={onSelectPlan} />);

    fireEvent.change(screen.getByPlaceholderText('Buscar destino o plan...'), {
      target: { value: 'san andrés' },
    });

    expect(screen.getByRole('heading', { name: 'San Andrés' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Cartagena Mágica' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /ver plan/i }));
    expect(onSelectPlan).toHaveBeenCalledWith(plans[1]);
  });

  it('muestra todas las tarjetas al limpiar la búsqueda', () => {
    render(<CatalogSection plans={plans} onSelectPlan={vi.fn()} />);
    const input = screen.getByPlaceholderText('Buscar destino o plan...');
    fireEvent.change(input, { target: { value: 'bogota' } });
    expect(screen.queryByRole('button', { name: /ver plan/i })).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getAllByRole('button', { name: /ver plan/i })).toHaveLength(2);
  });
});
