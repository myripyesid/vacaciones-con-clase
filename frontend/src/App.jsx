import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './components/common/Login';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // 1. Si hay token en la sesión, renderiza el CRM completo
  if (token) {
    return <Dashboard onLogout={handleLogout} />;
  }

  // 2. Si el usuario hizo clic en "Iniciar Sesión" desde el Navbar, renderiza el Login
  if (showLogin) {
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess}
        onGoHome={() => setShowLogin(false)}
      />
    );
  }

  // 3. Si no hay token, muestra la Landing Page del cliente
  return <Home onOpenLogin={() => setShowLogin(true)} />;
}