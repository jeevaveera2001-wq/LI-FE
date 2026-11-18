import React from 'react';
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

export default function App() {
  return (
    <div className="flex min-h-screen flex-col antialiased MQe55a_variable ExPGsG_variable JZWkmW_variable Ia0HiG_variable eSu7da_variable wat7GG_variable n_j4Eq_variable gsYqIG_variable">
      <a className="skip-link primary-bold-s14-lh120 webview-hide" href="#main-content">
        Skip to main content
      </a>
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <main
        className="bg-white-dirty flex h-full flex-1 flex-col lg:ps-sidebar-width"
        id="main-content"
        tabIndex={-1}
      >
        <HeroSection />
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
    </div>
  );
}
