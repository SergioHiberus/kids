import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Home, Plus, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ProfileDetail from './components/ProfileDetail';
import ProfileForm from './components/ProfileForm';
import FamilySettings from './components/FamilySettings';
import LoginButton from './components/LoginButton';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { initializeStorage } from './utils/storage';
import './index.css';

function AppContent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="header shadow-sm">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Home className="text-primary" />
            <h1 style={{ fontSize: 'var(--font-size-xl)', margin: 0, background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Aprendizaje por Refuerzo
            </h1>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            {user && (
              <Link to="/family-settings" className="btn btn-icon btn-secondary" title="Configuración de Familia" style={{ display: 'flex', padding: '8px' }}>
                <Settings size={20} />
              </Link>
            )}
            <LoginButton />
            <Link to="/new-profile" className="btn btn-primary">
              <Plus size={20} />
              <span>Nuevo Perfil</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-profile" element={<ProfileForm />} />
          <Route path="/edit-profile/:id" element={<ProfileForm />} />
          <Route path="/profile/:id" element={<ProfileDetail />} />
          <Route path="/family-settings" element={<FamilySettings />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeStorage().then(() => setInitialized(true));
  }, []);

  if (!initialized) return <div className="container">Cargando...</div>;

  return (
    <AuthProvider>
      <Router basename="/kids">
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
