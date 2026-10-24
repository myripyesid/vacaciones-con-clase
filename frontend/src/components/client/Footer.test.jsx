import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Información de contacto', () => {
  it('expone teléfono, correo y ubicación en la sección de contacto', () => {
    render(<Footer />);
    const contact = screen.getByRole('heading', { name: 'CONTACTO' }).parentElement;
    expect(within(contact).getByText('+57 300 123 4567')).toBeInTheDocument();
    expect(within(contact).getByText('info@vacacionesconclase.com')).toBeInTheDocument();
    expect(within(contact).getByText('Bogotá, Colombia')).toBeInTheDocument();
  });
});
