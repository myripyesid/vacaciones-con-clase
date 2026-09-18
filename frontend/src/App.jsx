import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturedPlans from './components/FeaturedPlans';
import WhyUsSection from './components/WhyUsSection';
import PlanDetail from './components/PlanDetail';
import CatalogSection from './components/CatalogSection';
import Footer from './components/Footer';
import Login from './components/Login'; // <-- 1. Importamos el Login

export default function App() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'catalog' | 'login'
  
  // 2. Estado de autenticación
  const [token, setToken] = useState(null);

  // Verificamos si existe una sesión previa guardada al cargar la app
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Carga de planes desde tu API en Django
  useEffect(() => {
    fetch('http://localhost:8000/api/planes/')
      .then((res) => res.json())
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando planes:', err);
        setLoading(false);
      });
  }, []);

  // Funciones de navegación
  const handleGoHome = () => {
    setSelectedPlan(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToCatalog = () => {
    setSelectedPlan(null);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToLogin = () => {
    setSelectedPlan(null);
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentView('home');
  };

  // 3. Si el Asesor ya está autenticado, mostramos el Panel Privado
  if (token) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] p-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-slate-900">Panel de Asesores</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-600 text-sm">
            ¡Bienvenido! Sesión activa con el Token: <code className="bg-slate-100 p-1 rounded text-xs">{token}</code>
          </p>
        </div>
      </div>
    );
  }

  // 4. Si la vista actual es 'login', renderizamos el formulario de acceso
  if (currentView === 'login') {
    return (
      <Login 
        onLoginSuccess={(newToken) => {
          setToken(newToken);
          setCurrentView('home');
        }} 
        onGoHome={handleGoHome}
      />
    );
  }

  // 5. Vista pública normal (Landing Page)
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between">
      <Navbar 
        onGoHome={handleGoHome} 
        onGoToCatalog={handleGoToCatalog} 
        onGoToLogin={handleGoToLogin} // <-- Pasamos el handler al Navbar
      />

      <main className="grow">
        {selectedPlan ? (
          <PlanDetail
            plan={selectedPlan}
            onBack={handleGoHome}
          />
        ) : currentView === 'catalog' ? (
          <CatalogSection
            plans={plans}
            loading={loading}
            onSelectPlan={(plan) => setSelectedPlan(plan)}
          />
        ) : (
          <>
            <HeroSection />
            <FeaturedPlans
              plans={plans || []}
              loading={loading}
              onSelectPlan={(plan) => setSelectedPlan(plan)}
              onGoToCatalog={handleGoToCatalog}
            />
            <WhyUsSection />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}