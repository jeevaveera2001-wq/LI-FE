import React, { useState, useEffect, Component } from 'react';
import Sidebar from './components/Sidebar';
import HeroSection from './components/HeroSection';
import NewsletterSection from './components/NewsletterSection';
import GamesSection from './components/GamesSection';
import FeaturedTournamentsSection from './components/FeaturedTournamentsSection';
import ChampionshipTrophySection from './components/ChampionshipTrophySection';
import HostTournamentsSection from './components/HostTournamentsSection';
import RecapsSection from './components/RecapsSection';
import PartnersSection from './components/PartnersSection';
import Footer from './components/Footer';
import AuthPage from './components/AuthPage';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import UserDashboard from './components/UserDashboard';
import UserMenu from './components/UserMenu';
import AboutPage from './components/AboutPage';
import { TopProgressBar, FullScreenLoader, PullToRefreshLoader, LoadersShowcaseModal } from './components/loaders';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-neutral-900 border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-gold-primary mb-2">LiveTournaments.in Hub</h2>
            <p className="text-sm text-gray-300 mb-6">
              A temporary interface issue occurred. Click below to refresh and return to the main arena.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
              className="px-6 py-2.5 rounded-xl bg-gold-primary text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-light transition-all"
            >
              Return to Home Arena
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('lt_user');
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('admin') || hash.includes('admin')) return 'admin-dashboard';
      if (path.includes('dashboard') || hash.includes('dashboard')) return 'user-dashboard';
      if (path.includes('login') || hash.includes('login')) return 'login';
      if (path.includes('register') || hash.includes('register')) return 'register';
      if (path.includes('about') || hash.includes('about')) return 'about';
    }
    return 'home';
  });

  // Global Loaders State
  const [isNavigating, setIsNavigating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLoadersModal, setShowLoadersModal] = useState(false);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);

  const navigateTo = (page, sectionId) => {
    setIsNavigating(true);
    setTimeout(() => setIsNavigating(false), 450);
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      let targetUrl = '/';
      if (page === 'admin-dashboard') targetUrl = '/admin';
      else if (page === 'user-dashboard') targetUrl = '/dashboard';
      else if (page === 'about') targetUrl = '/about';
      else if (page !== 'home') targetUrl = `/${page}`;

      if (sectionId) {
        targetUrl += `#${sectionId}`;
      }

      window.history.pushState({ page, sectionId }, '', targetUrl);
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePullRefresh = () => {
    setIsRefreshing(true);
    setIsNavigating(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setIsNavigating(false);
    }, 1200);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user && (user.role === 'superadmin' || user.email === 'superadmin@lt.in')) {
      navigateTo('admin-dashboard');
    } else {
      navigateTo('user-dashboard');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('lt_user');
    } catch (e) {}
    setCurrentUser(null);
    navigateTo('home');
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('admin') || hash.includes('admin')) {
        setCurrentPage('admin-dashboard');
      } else if (path.includes('dashboard') || hash.includes('dashboard')) {
        setCurrentPage('user-dashboard');
      } else if (path.includes('login') || hash.includes('login')) {
        setCurrentPage('login');
      } else if (path.includes('register') || hash.includes('register')) {
        setCurrentPage('register');
      } else if (path.includes('about') || hash.includes('about')) {
        setCurrentPage('about');
      } else {
        setCurrentPage('home');
        if (window.location.hash) {
          const hashId = window.location.hash.replace('#', '');
          setTimeout(() => {
            const el = document.getElementById(hashId);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Check initial hash on mount
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(hashId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <ErrorBoundary>
      {/* 3. Top Progress Bar for Page Navigation & Transitions */}
      <TopProgressBar active={isNavigating || isRefreshing} />

      <div className="flex min-h-screen flex-col antialiased MQe55a_variable ExPGsG_variable JZWkmW_variable Ia0HiG_variable eSu7da_variable wat7GG_variable n_j4Eq_variable gsYqIG_variable">
        <a className="skip-link primary-bold-s14-lh120 webview-hide" href="#main-content">
          Skip to main content
        </a>

        {/* SUPER ADMIN LIVE DASHBOARD - Dedicated SaaS Command Portal (Exact Nagulan Layout) */}
        {currentPage === 'admin-dashboard' ? (
          <SuperAdminDashboard
            currentUser={currentUser}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        ) : currentPage === 'user-dashboard' ? (
          <UserDashboard
            currentUser={currentUser}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        ) : currentPage === 'login' || currentPage === 'register' ? (
          <AuthPage
            initialMode={currentPage === 'register' ? 'register' : 'login'}
            onNavigate={navigateTo}
            onNavigateHome={() => navigateTo('home')}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          /* HOME & ABOUT ARENA SHELL */
          <PullToRefreshLoader onRefresh={handlePullRefresh} isRefreshing={isRefreshing}>
            {/* User Menu Header Dropdown Option */}
            <UserMenu
              currentUser={currentUser}
              onNavigate={navigateTo}
              onLogout={handleLogout}
            />

            {/* Left Sidebar Navigation */}
            <Sidebar
              onNavigate={navigateTo}
              currentPage={currentPage}
              currentUser={currentUser}
            />

            {/* Main Content Area */}
            <main
              className="bg-white-dirty flex h-full flex-1 flex-col lg:ps-sidebar-width min-h-screen"
              id="main-content"
              tabIndex={-1}
            >
              {currentPage === 'about' ? (
                <AboutPage
                  currentUser={currentUser}
                  onNavigate={navigateTo}
                />
              ) : (
                <>
                  <HeroSection onNavigate={navigateTo} />
                  <NewsletterSection />
                  <GamesSection />
                  <FeaturedTournamentsSection onNavigate={navigateTo} currentUser={currentUser} />
                  <ChampionshipTrophySection onNavigate={navigateTo} />
                  <HostTournamentsSection onNavigate={navigateTo} />
                  <RecapsSection />
                  <PartnersSection />
                </>
              )}
            </main>

            {/* Footer */}
            <Footer />
          </PullToRefreshLoader>
        )}

        {/* Interactive Loaders Suite Showcase Trigger Pill */}
        <button
          onClick={() => setShowLoadersModal(true)}
          title="Preview All 8 LiveTournaments Loaders"
          className="fixed bottom-5 left-5 z-40 px-3.5 py-2 rounded-full bg-[#0E0E10] text-[#DFBD78] hover:bg-gold-primary hover:text-black border border-[#DFBD78]/60 shadow-2xl text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer group"
        >
          <span className="material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform duration-500">hourglass_top</span>
          <span>Loaders Suite (8)</span>
        </button>

        {/* All 8 Loaders Interactive Suite Modal */}
        <LoadersShowcaseModal
          isOpen={showLoadersModal}
          onClose={() => setShowLoadersModal(false)}
        />

        {/* Full Screen Esports Loader */}
        <FullScreenLoader
          isOpen={fullScreenLoading}
          onClose={() => setFullScreenLoading(false)}
        />
      </div>
    </ErrorBoundary>
  );
}
