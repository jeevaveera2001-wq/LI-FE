import React, { useState, useEffect } from 'react';
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

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      let targetUrl = '/';
      if (page === 'admin-dashboard') targetUrl = '/admin';
      else if (page === 'user-dashboard') targetUrl = '/dashboard';
      else if (page === 'about') targetUrl = '/about';
      else if (page !== 'home') targetUrl = `/${page}`;

      window.history.pushState({ page }, '', targetUrl);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
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
      ) : currentPage === 'login' || currentPage === 'register' ? (
        <AuthPage
          initialMode={currentPage === 'register' ? 'register' : 'login'}
          onNavigate={navigateTo}
          onNavigateHome={() => navigateTo('home')}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        /* HOME, ABOUT, & USER DASHBOARD ARENA SHELL */
        <>
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
            {currentPage === 'user-dashboard' ? (
              <UserDashboard
                currentUser={currentUser}
                onNavigate={navigateTo}
                onLogout={handleLogout}
              />
            ) : currentPage === 'about' ? (
              <AboutPage
                currentUser={currentUser}
                onNavigate={navigateTo}
              />
            ) : (
              <>
                <HeroSection onNavigate={navigateTo} />
                <NewsletterSection />
                <GamesSection />
                <FeaturedTournamentsSection />
                <ChampionshipTrophySection />
                <HostTournamentsSection />
                <RecapsSection />
                <PartnersSection />
              </>
            )}
          </main>

          {/* Footer */}
          <Footer />
        </>
      )}
    </div>
  );
}
