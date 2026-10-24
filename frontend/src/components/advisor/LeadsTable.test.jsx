import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LeadsTable from './LeadsTable';

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

describe('Tabla y filtro de leads', () => {
  it('muestra contacto y plan, y filtra los leads por estado', () => {
    render(<LeadsTable leads={leads} />);
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
    expect(screen.getByText('3001234567')).toBeInTheDocument();
    expect(screen.getByText('Cartagena Mágica')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'GANADO' } });
    expect(screen.getByText('Luis Díaz')).toBeInTheDocument();
    expect(screen.queryByText('Ana Pérez')).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'TODOS' } });
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('Luis Díaz')).toBeInTheDocument();
  });

  it('explica cuando los filtros no devuelven leads', () => {
    render(<LeadsTable leads={[]} />);
    expect(screen.getByText('No se encontraron leads que coincidan con los filtros.')).toBeInTheDocument();
  });
});
