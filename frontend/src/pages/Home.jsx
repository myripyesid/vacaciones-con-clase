import { useState, useEffect } from 'react';
import Navbar from '../components/client/Navbar';
import HeroSection from '../components/client/HeroSection';
import WhyUsSection from '../components/client/WhyUsSection';
import FeaturedPlans from '../components/client/FeaturedPlans';
import CatalogSection from '../components/client/CatalogSection';
import PlanDetail from '../components/client/PlanDetail';
import Footer from '../components/client/Footer';

export default function Home({ onOpenLogin }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'catalog'

  // Carga de planes desde la API pública de Django
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

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between">
      <Navbar 
        onGoHome={handleGoHome} 
        onGoToCatalog={handleGoToCatalog} 
        onGoToLogin={onOpenLogin}
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