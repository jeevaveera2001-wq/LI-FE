import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { TrophiesSection } from './components/sections/TrophiesSection';
import { TournamentsSection } from './components/sections/TournamentsSection';
import { WinnersSection } from './components/sections/WinnersSection';
import { UpcomingTournamentsSection } from './components/sections/UpcomingTournamentsSection';
import { SponsorsSection } from './components/sections/SponsorsSection';
import { ContactSection } from './components/sections/ContactSection';
import { TournamentRegistrationModal } from './components/TournamentRegistrationModal';
import { SponsorRequestModal } from './components/SponsorRequestModal';
import { LiveStreamModal } from './components/LiveStreamModal';
import { LoginModal } from './components/LoginModal';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { TeamPortal } from './components/TeamPortal';
import { MobileDrawer } from './components/MobileDrawer';
import { FullPageAuth } from './components/FullPageAuth';
import { FullPageTournamentsOverview } from './components/FullPageTournamentsOverview';
import { FullPageTournamentRegistration } from './components/FullPageTournamentRegistration';
import { getActiveSession, logoutUser } from './utils/auth';
import { soundFx } from './utils/audio';

export function App() {
  const [activeSection, setActiveSection] = useState('hero');
  // Full-page View Router: 'portal' | 'auth' | 'overview' | 'registration' | 'superadmin' | 'admin' | 'team'
  const [currentView, setCurrentView] = useState('portal');

  // Interactive Modals State
  const [isTournamentModalOpen, setIsTournamentModalOpen] = useState(false);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [isLiveStreamModalOpen, setIsLiveStreamModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loginModalTab, setLoginModalTab] = useState('login'); // 'login' | 'register'

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);

  // Restore JWT session on app load
  useEffect(() => {
    const restoreSession = async () => {
      const session = await getActiveSession();
      if (session && session.user) {
        setCurrentUser(session.user);
      }
    };
    restoreSession();
  }, []);

  const handleOpenTournamentModal = (tournament) => {
    setSelectedTournament(tournament || null);
    setCurrentView('registration');
  };

  const handleCloseTournamentModal = () => {
    setIsTournamentModalOpen(false);
  };

  const handleOpenLiveStreamModal = () => {
    setIsLiveStreamModalOpen(true);
  };

  const handleCloseLiveStreamModal = () => {
    setIsLiveStreamModalOpen(false);
  };

  const handleOpenLogin = (tab = 'login', fullPage = true) => {
    setLoginModalTab(tab);
    if (fullPage) {
      setCurrentView('auth');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleOpenSuperAdmin = () => {
    if (currentUser && currentUser.role === 'SUPER_ADMIN') {
      setCurrentView('superadmin');
    } else if (currentUser) {
      setCurrentView('admin');
    } else {
      setCurrentView('auth');
    }
  };

  const handleOpenAdmin = () => {
    if (currentUser) {
      setCurrentView('admin');
    } else {
      setCurrentView('auth');
    }
  };

  const handleAuthPageSuccess = (userOrTeam, token, type) => {
    if (type === 'team' || userOrTeam?.ticketId || userOrTeam?.passcode) {
      setCurrentTeam(userOrTeam);
      setCurrentView('team');
    } else {
      setCurrentUser(userOrTeam);
      setCurrentView('overview');
    }
  };

  const handleLoginSuccess = (userOrTeam, token, type) => {
    setIsLoginModalOpen(false);

    if (type === 'team' || userOrTeam?.ticketId || userOrTeam?.passcode) {
      setCurrentTeam(userOrTeam);
      setCurrentView('team');
    } else {
      setCurrentUser(userOrTeam);
      if (userOrTeam?.role === 'SUPER_ADMIN') {
        setCurrentView('superadmin');
      } else if (userOrTeam?.role === 'ADMIN') {
        setCurrentView('admin');
      } else {
        setCurrentView('overview');
      }
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setCurrentTeam(null);
    setCurrentView('portal');
  };

  // Scroll spy for public landing page
  useEffect(() => {
    if (currentView !== 'portal') return;

    const handleScroll = () => {
      const sections = ['hero', 'trophies', 'tournaments', 'winners', 'upcoming', 'sponsors', 'contact'];
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // VIEW 1: SUPERADMIN FULL-PAGE DASHBOARD
  if (currentView === 'superadmin') {
    return (
      <>
        <SuperAdminDashboard
          user={currentUser}
          onLogout={handleLogout}
          onSwitchToAdmin={() => setCurrentView('admin')}
          onBackToPortal={() => setCurrentView('portal')}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={handleCloseLogin}
          onLoginSuccess={handleLoginSuccess}
          initialTab={loginModalTab}
        />
      </>
    );
  }

  // VIEW 2: MATCH OPS ADMIN FULL-PAGE DASHBOARD
  if (currentView === 'admin') {
    return (
      <>
        <AdminDashboard
          user={currentUser}
          onLogout={handleLogout}
          onSwitchToSuperAdmin={currentUser?.role === 'SUPER_ADMIN' ? () => setCurrentView('superadmin') : undefined}
          onBackToPortal={() => setCurrentView('portal')}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={handleCloseLogin}
          onLoginSuccess={handleLoginSuccess}
          initialTab={loginModalTab}
        />
      </>
    );
  }

  // VIEW 3: TEAM / PLAYER DEDICATED ROOM DISPATCHER PORTAL
  if (currentView === 'team') {
    return (
      <>
        <TeamPortal
          team={currentTeam}
          onLogout={handleLogout}
          onBackToPortal={() => setCurrentView('portal')}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={handleCloseLogin}
          onLoginSuccess={handleLoginSuccess}
          initialTab={loginModalTab}
        />
      </>
    );
  }

  // VIEW 4: FULL-PAGE WHITE-BACKGROUND AUTHENTICATION (LOGIN / REGISTER WITH OTP)
  if (currentView === 'auth') {
    return (
      <FullPageAuth
        initialTab={loginModalTab}
        onLoginSuccess={handleAuthPageSuccess}
        onBackToPortal={() => setCurrentView('portal')}
      />
    );
  }

  // VIEW 5: FULL-PAGE WHITE-BACKGROUND OVERALL TOURNAMENTS & SCRIMS HUB
  if (currentView === 'overview') {
    return (
      <FullPageTournamentsOverview
        currentUser={currentUser}
        onLogout={handleLogout}
        onBackToPortal={() => setCurrentView('portal')}
        onOpenAdmin={() => setCurrentView('admin')}
        onOpenSuperAdmin={() => setCurrentView('superadmin')}
        onOpenRegisterTournament={handleOpenTournamentModal}
      />
    );
  }

  // VIEW 6: FULL-PAGE WHITE-BACKGROUND TOURNAMENT REGISTRATION (ENTIRE PAGE, NOT FLOATING)
  if (currentView === 'registration') {
    return (
      <FullPageTournamentRegistration
        selectedTournament={selectedTournament}
        currentUser={currentUser}
        onBackToPortal={() => setCurrentView('portal')}
        onOpenOverview={() => setCurrentView('overview')}
      />
    );
  }

  // VIEW 7: PUBLIC PORTAL (FULL SCREEN)
  return (
    <div className="min-h-screen bg-[#090B0E] text-[#E2E8F0] font-sans flex antialiased selection:bg-[#E5C05B]/30 selection:text-[#E5C05B]">
      
      {/* Left Slim Vertical Icon Sidebar (Desktop) */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        currentUser={currentUser}
        onOpenSuperAdmin={handleOpenSuperAdmin}
        onOpenAdmin={handleOpenAdmin}
        onOpenOverview={() => setCurrentView('overview')}
        onOpenLogin={() => handleOpenLogin('login', true)}
      />

      {/* Main App Canvas */}
      <div className="flex-1 lg:pl-14 flex flex-col min-h-screen w-full">
        
        {/* Top Navbar */}
        <Navbar
          currentUser={currentUser}
          onOpenLogin={() => handleOpenLogin('login', true)}
          onOpenSuperAdmin={handleOpenSuperAdmin}
          onOpenAdmin={handleOpenAdmin}
          onOpenOverview={() => setCurrentView('overview')}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        />

        {/* Full-Bleed Hero Landing Screen (Retained in Black Mode as requested) */}
        <HeroSection
          onJoinNow={() => {
            soundFx.playModalOpen();
            if (!currentUser) {
              setCurrentView('auth');
            } else {
              setCurrentView('overview');
            }
          }}
          onOpenTournamentModal={handleOpenTournamentModal}
        />

        {/* White Background Wrapper for All Sections Below Hero */}
        <div className="w-full bg-[#F8FAFC] text-[#0F172A] border-t border-[#CBD5E1]">
          {/* Main Content Sections */}
          <main className="p-3 sm:p-5 lg:p-6 max-w-[1500px] w-full mx-auto space-y-10">
            
            {/* Section 2: Featured Tournaments & Championship Metrics */}
            <TrophiesSection />

            {/* Section 3: Tournaments Hub & Live Countdown */}
            <TournamentsSection onOpenTournamentModal={handleOpenTournamentModal} />

            {/* Section 4: Winners Cash List & Hall of Fame Squads (Seasonal, Solo, Duo, Squad) */}
            <WinnersSection onOpenTournamentModal={handleOpenTournamentModal} />

            {/* Section 5: Upcoming Tournaments Section */}
            <UpcomingTournamentsSection onOpenTournamentModal={handleOpenTournamentModal} />

            {/* Section 6: Sponsors & Supporters Showcase */}
            <SponsorsSection onOpenSponsorModal={() => setIsSponsorModalOpen(true)} />

            {/* Section 7: Contact Us & Official Enquiries Desk */}
            <ContactSection />

          </main>

          {/* Bottom Copyright Strip */}
          <footer className="py-7 px-6 border-t border-[#E2E8F0] text-center text-xs font-rajdhani text-[#64748B] bg-white">
            © {new Date().getFullYear()} Live tournaments.in. Official Competitive Arena.
          </footer>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        currentUser={currentUser}
        onOpenLogin={() => handleOpenLogin('login', true)}
        onOpenSuperAdmin={handleOpenSuperAdmin}
        onOpenAdmin={handleOpenAdmin}
        onOpenOverview={() => setCurrentView('overview')}
        onLogout={handleLogout}
      />

      {/* Interactive Registration Modal */}
      <TournamentRegistrationModal
        isOpen={isTournamentModalOpen}
        onClose={handleCloseTournamentModal}
        selectedTournament={selectedTournament}
      />

      {/* Sponsor Partnership Request Modal */}
      <SponsorRequestModal
        isOpen={isSponsorModalOpen}
        onClose={() => setIsSponsorModalOpen(false)}
      />

      {/* Live Stream Modal */}
      <LiveStreamModal
        isOpen={isLiveStreamModalOpen}
        onClose={handleCloseLiveStreamModal}
      />

      {/* Login Modal with SHA-256 Hashing & Signed JWT */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLogin}
        onLoginSuccess={handleLoginSuccess}
        initialTab={loginModalTab}
      />

    </div>
  );
}

export default App;