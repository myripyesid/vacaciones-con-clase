import React, { useState, useEffect } from 'react';
import Sidebar from '../components/advisor/Sidebar';
import DashboardHeader from '../components/advisor/DashboardHeader';
import MetricsGrid from '../components/advisor/MetricsGrid';
import PipelineSection from '../components/advisor/PipelineSection';
import RecentActivity from '../components/advisor/RecentActivity';

export default function Dashboard({ onLogout }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setLeads(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      {/* Sidebar Fijo */}
      <Sidebar onLogout={onLogout} />

      {/* Área de Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <DashboardHeader />

        {/* Manejo de Carga y Errores */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-500 font-medium animate-pulse">
              Cargando tus leads...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 text-sm">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Grilla de Métricas */}
            <MetricsGrid leads={leads} />

            {/* Sección Inferior */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PipelineSection leads={leads} />
              <RecentActivity leads={leads} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}