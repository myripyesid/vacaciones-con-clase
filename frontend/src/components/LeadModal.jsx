import { useState } from 'react';
import { submitSolicitud } from '../api/planes';

export default function LeadModal({ plan, onClose }) {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    presupuesto: '',
    fechas_tentativas: '',
  });
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const title = plan.titulo || plan.nombre || plan.title;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const data = await submitSolicitud({
        ...formData,
        plan_id: plan.id,
        presupuesto: parseFloat(formData.presupuesto) || 0,
      });

      setFeedback({
        type: 'success',
        message: `¡Solicitud enviada! Asesor asignado: ${data.data?.assigned_advisor || 'Carlos Mendoza'}`,
      });
      setTimeout(onClose, 2500);
    } catch {
      setFeedback({ type: 'error', message: 'No se pudo procesar la solicitud.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
        <h3 className="text-xl font-bold font-serif text-slate-900 mb-1">Solicitar Cotización</h3>
        <p className="text-xs text-[#CA8A04] font-semibold mb-6">Plan: {title}</p>

        {feedback.message && (
          <div className={`p-3 rounded-lg text-xs font-medium mb-4 ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="nombre_completo"
            placeholder="Nombre completo"
            value={formData.nombre_completo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="presupuesto"
              placeholder="Presupuesto ($)"
              value={formData.presupuesto}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            <input
              type="text"
              name="fechas_tentativas"
              placeholder="Fechas tentativas"
              value={formData.fechas_tentativas}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 bg-[#CA8A04] hover:bg-[#B45309] text-slate-950 font-semibold py-3 rounded-lg text-sm transition"
          >
            {submitting ? 'Enviando...' : 'Enviar Cotización 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}