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

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('login') || hash.includes('login')) return 'login';
      if (path.includes('register') || hash.includes('register')) return 'register';
    }
    return 'home';
  });

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      const targetUrl = page === 'home' ? '/' : `/${page}`;
      window.history.pushState({ page }, '', targetUrl);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('login') || hash.includes('login')) {
        setCurrentPage('login');
      } else if (path.includes('register') || hash.includes('register')) {
        setCurrentPage('register');
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

      {currentPage === 'login' || currentPage === 'register' ? (
        <AuthPage
          initialMode={currentPage === 'register' ? 'register' : 'login'}
          onNavigateHome={() => navigateTo('home')}
        />
      ) : (
        <>
          {/* Sidebar Navigation */}
          <Sidebar onNavigate={navigateTo} currentPage={currentPage} />

          {/* Main Content */}
          <main
            className="bg-white-dirty flex h-full flex-1 flex-col lg:ps-sidebar-width"
            id="main-content"
            tabIndex={-1}
          >
            <HeroSection onNavigate={navigateTo} />
            <NewsletterSection />
            <GamesSection />
            <FeaturedTournamentsSection />
            <ChampionshipTrophySection />
            <HostTournamentsSection />
            <RecapsSection />
            <PartnersSection />
          </main>

          {/* Footer */}
          <Footer />
        </>
      )}
    </div>
  );
}
