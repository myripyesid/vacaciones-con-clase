import { useEffect, useState } from 'react';
import { ESTADO_CONFIG } from './LeadVisualization';
import { fetchLeadDetail } from '../../api/leads';

const formatMoney = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const formatDateTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// fechas_tentativas llega como "YYYY-MM-DD": se fuerza hora local para evitar corrimiento de día.
const formatDateOnly = (value) => {
  if (!value) return '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

function Field({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900 break-words">{children || '—'}</dd>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-bold text-brand-blue">{title}</h2>
      <dl className="space-y-4">{children}</dl>
    </section>
  );
}

// Usar <LeadDetail key={leadId} ... /> para que cambiar de lead reinicie el estado.
export default function LeadDetail({ leadId, onBack }) {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchLeadDetail(leadId)
      .then((data) => { if (!cancelled) setLead(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [leadId]);

  const estado = lead ? ESTADO_CONFIG[lead.estado?.toUpperCase()] : null;

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-sm font-medium text-brand-blue hover:text-brand-blue-hover"
      >
        ← Volver a leads
      </button>

      {loading && (
        <p className="py-16 text-center text-sm font-medium text-slate-500 animate-pulse">
          Cargando lead...
        </p>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      {lead && (
        <>
          <header className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900">
              {lead.cliente.nombre_completo}
            </h1>
            <span
              className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${
                estado ? `${estado.bg} ${estado.text} ${estado.border}` : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              {estado?.label || lead.estado_display}
            </span>
            <span className="text-xs text-slate-500">
              Lead #{lead.id} · recibido {formatDateTime(lead.fecha_creacion)}
            </span>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card title="Cliente">
              <Field label="Nombre">{lead.cliente.nombre_completo}</Field>
              <Field label="Correo">
                <a className="text-brand-blue hover:underline" href={`mailto:${lead.cliente.email}`}>
                  {lead.cliente.email}
                </a>
              </Field>
              <Field label="Teléfono">
                <a className="text-brand-blue hover:underline" href={`tel:${lead.cliente.telefono}`}>
                  {lead.cliente.telefono}
                </a>
              </Field>
              <Field label="Cliente desde">{formatDateTime(lead.cliente.fecha_registro)}</Field>
            </Card>

            <Card title="Plan de interés">
              <Field label="Plan">{lead.plan.titulo}</Field>
              <Field label="Destino">{lead.plan.destino}</Field>
              <Field label="Precio de referencia">{formatMoney(lead.plan.precio_referencia)}</Field>
              <Field label="Incluye">{lead.plan.incluye}</Field>
            </Card>

            <Card title="Solicitud">
              <Field label="Presupuesto del cliente">{formatMoney(lead.presupuesto)}</Field>
              <Field label="Fechas tentativas">{formatDateOnly(lead.fechas_tentativas)}</Field>
              <Field label="Observaciones">{lead.observaciones}</Field>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
