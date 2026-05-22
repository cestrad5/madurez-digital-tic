import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

const Landing    = lazy(() => import('./pages/Landing'));
const Login      = lazy(() => import('./pages/Login'));
const Assessment = lazy(() => import('./pages/Assessment'));
const Results    = lazy(() => import('./pages/Results'));
const Roadmap    = lazy(() => import('./pages/Roadmap'));
const History    = lazy(() => import('./pages/History'));
const Dashboard  = lazy(() => import('./pages/Dashboard'));
const Profile    = lazy(() => import('./pages/Profile'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ProtectedRoute = ({ element }) => {
  const isLoggedIn = !!localStorage.getItem('user');
  const location = useLocation();
  return isLoggedIn ? element : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <div className="spinner" />
  </div>
);

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '5rem', fontWeight: 900, color: '#E5E7EB' }}>404</div>
      <h2 style={{ color: '#1A2E1A' }}>Página no encontrada</h2>
      <p style={{ color: '#6B7280', maxWidth: '400px' }}>La página que busca no existe o fue movida.</p>
      <button
        type="button"
        onClick={() => navigate('/')}
        style={{ background: '#4C9B2F', color: 'white', padding: '0.875rem 2rem', borderRadius: 'var(--radius)', fontWeight: 700, border: 'none', cursor: 'pointer' }}
      >
        Volver al Inicio
      </button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ScrollToTop />
        <Header />
        <main style={{ flex: 1 }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/assessment" element={<ProtectedRoute element={<Assessment />} />} />
              <Route path="/results/:id" element={<ProtectedRoute element={<Results />} />} />
              <Route path="/roadmap/:id" element={<ProtectedRoute element={<Roadmap />} />} />
              <Route path="/history" element={<ProtectedRoute element={<History />} />} />
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/profile"  element={<ProtectedRoute element={<Profile />} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
