import React, { useState, useEffect } from 'react';
import Sidebar from "../components/advisor/Sidebar";
import LeadsHeader from "../components/advisor/LeadsHeader";
import LeadsSearchBar from "../components/advisor/LeadsSearchBar";
import LeadsTable from "../components/advisor/LeadsTable";
import LeadDetail from "../components/advisor/LeadDetail";

export default function LeadsBoard({ onLogout, currentView, onNavigate }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState(null); // HU-15

  useEffect(() => {
    const fetchLeads = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No se encontró sesión activa.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/asesor/leads/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error en la petición: ${response.statusText}`);
        }

        const data = await response.json();
        const leadsList = Array.isArray(data) ? data : (data.results || []);
        setLeads(leadsList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Filtrado en vivo: se recalcula en cada render a partir de `leads`
  // y `searchQuery` (que llega ya "debounced" desde LeadsSearchBar).
  const query = searchQuery.trim().toLowerCase();
  const filteredLeads = query === ''
    ? leads
    : leads.filter((lead) => {
        const nombre = lead.cliente_nombre?.toLowerCase() || '';
        const email = lead.cliente_email?.toLowerCase() || '';
        const telefono = lead.cliente_telefono?.toLowerCase() || '';
        const plan = lead.plan_nombre?.toLowerCase() || '';

        return (
          nombre.includes(query) ||
          email.includes(query) ||
          telefono.includes(query) ||
          plan.includes(query)
        );
      });

  // HU-14: cantidad de leads nuevos para el badge del sidebar
  const newLeadsCount = leads.filter((l) => l.estado?.toUpperCase() === 'NUEVO').length;

  return (
    <div className="flex min-h-screen flex-col bg-brand-gray-light md:flex-row">
      {/* Sidebar Fijo (se mantiene la navegación actual) */}
      <Sidebar 
      onLogout={onLogout}
      currentView={currentView}
      onNavigate={onNavigate}
      newLeadsCount={newLeadsCount}
      />

      {/* Área de Contenido Principal de Leads */}
      <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {selectedLeadId !== null ? (
          <LeadDetail
            key={selectedLeadId}
            leadId={selectedLeadId}
            onBack={() => setSelectedLeadId(null)}
          />
        ) : (
        <>
        <LeadsHeader leads={leads} />

        {/* Manejo de Carga y Errores */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-500 font-medium animate-pulse">
              Cargando tus leads...
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            <div className="flex gap-3">
              <LeadsSearchBar onSearch={setSearchQuery} />
            </div>

            <LeadsTable leads={filteredLeads} onSelectLead={setSelectedLeadId} />
          </div>
        )}
        </>
        )}

      </main>
    </div>
  );
}
