import React, { useState, useEffect, useMemo } from 'react';
import { SkeletonLoader, InfiniteScrollLoader, ButtonLoader } from './loaders';
import InteractiveTournamentSpotlight from './InteractiveTournamentSpotlight';
import PreviousFinishedMatchesSection from './PreviousFinishedMatchesSection';
import { loadLiveTournaments } from './FeaturedTournamentsSection';

export default function TournamentsPage({ onNavigate, currentUser }) {
  const [liveTournaments, setLiveTournaments] = useState(() => loadLiveTournaments());

  useEffect(() => {
    const handleSync = () => {
      setLiveTournaments(loadLiveTournaments());
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('lt_hosting_requested', handleSync);
    window.addEventListener('lt_room_requested', handleSync);
    window.addEventListener('lt_scrim_requested', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('lt_hosting_requested', handleSync);
      window.removeEventListener('lt_room_requested', handleSync);
      window.removeEventListener('lt_scrim_requested', handleSync);
    };
  }, []);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeSquadType, setActiveSquadType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [spotlightTourney, setSpotlightTourney] = useState(null);

  // Modal State
  const [selectedTourney, setSelectedTourney] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [squadName, setSquadName] = useState('');
  const [leaderIgn, setLeaderIgn] = useState('');
  const [characterId, setCharacterId] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [teammates, setTeammates] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regSuccessData, setRegSuccessData] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Active user helper
  const getActiveUser = () => {
    if (currentUser) return currentUser;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('lt_user');
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const activeUser = getActiveUser();

  // Joined Tournaments Sync
  const [joinedTourneyIds, setJoinedTourneyIds] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lt_user_joined_tourneys');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return new Set(parsed.map(t => t.id || t.tourneyId || t.title));
          }
        }
      } catch (e) {}
    }
    return new Set();
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleCategoryChange = (cat) => {
    setIsFiltering(true);
    setActiveCategory(cat);
    setTimeout(() => setIsFiltering(false), 220);
  };

  const handleSquadChange = (sq) => {
    setIsFiltering(true);
    setActiveSquadType(sq);
    setTimeout(() => setIsFiltering(false), 220);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setIsFiltering(true);
    setTimeout(() => setIsFiltering(false), 200);
  };

  // Close modals safely without navigation
  const handleCloseAuthModal = (e) => {
    if (e) e.stopPropagation();
    setShowAuthModal(false);
    setSelectedTourney(null);
  };

  const handleCloseRegistrationModal = (e) => {
    if (e) e.stopPropagation();
    setSelectedTourney(null);
    setRegSuccessData(null);
  };

  // Open Registration Modal with strict sign-in verification
  const handleOpenRegister = (tourney) => {
    const activeUser = getActiveUser();

    if (!activeUser) {
      setSelectedTourney(tourney);
      setShowAuthModal(true);
      return;
    }

    if (joinedTourneyIds.has(tourney.id) || joinedTourneyIds.has(tourney.title)) {
      showToast(`✓ You are already registered for ${tourney.title}. Opening Dashboard...`);
      if (onNavigate) {
        setTimeout(() => onNavigate('user-dashboard'), 600);
      }
      return;
    }

    setSelectedTourney(tourney);
    setRegSuccessData(null);
    setSquadName(activeUser.clan || '');
    setLeaderIgn(activeUser.username || activeUser.name || '');
    setCharacterId('');
    setWhatsappNumber(activeUser.mobile || '');
    setTeammates('');
  };

  // Submit Match Registration
  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    const activeUser = getActiveUser();
    if (!activeUser || !selectedTourney) return;

    if (!squadName.trim() || !leaderIgn.trim() || !characterId.trim()) {
      showToast('⚠️ Please fill Squad Name, In-Game Name, and Character ID.');
      return;
    }

    setIsRegistering(true);

    try {
      const roomPass = 'LT-' + Math.floor(100000 + Math.random() * 900000);
      const slotNum = Math.floor(1 + Math.random() * 25);
      const regId = 'REG-' + Date.now().toString().slice(-6);

      const newRegistration = {
        id: regId,
        tourneyId: selectedTourney.id,
        title: selectedTourney.title,
        game: selectedTourney.game,
        schedule: selectedTourney.schedule,
        prizePool: selectedTourney.prizePool,
        squadName: squadName.trim(),
        leaderIgn: leaderIgn.trim(),
        characterId: characterId.trim(),
        whatsappNumber: whatsappNumber.trim() || activeUser.mobile || '',
        teammates: teammates.trim(),
        registeredAt: new Date().toISOString(),
        registeredTimeIST: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
        status: 'CONFIRMED',
        roomCredentials: {
          slotNumber: slotNum,
          roomCode: 'LT-ROOM-' + Math.floor(1000 + Math.random() * 9000),
          password: roomPass,
          distributionTime: '15 Minutes Before Match Start via SMS & Dashboard'
        }
      };

      // Save to localStorage joined tournaments
      const existing = JSON.parse(localStorage.getItem('lt_user_joined_tourneys') || '[]');
      existing.unshift(newRegistration);
      localStorage.setItem('lt_user_joined_tourneys', JSON.stringify(existing));

      setJoinedTourneyIds(prev => new Set([...prev, selectedTourney.id, selectedTourney.title]));
      setRegSuccessData(newRegistration);
      setIsRegistering(false);
      showToast(`🎉 Registration Confirmed for ${selectedTourney.title}!`);
    } catch (err) {
      console.error('Registration error:', err);
      setIsRegistering(false);
      showToast('⚠️ Registration error. Please try again.');
    }
  };

  // Filtered Tournaments
  const filteredTournaments = useMemo(() => {
    return liveTournaments.filter((tourney) => {
      // Category filter
      if (activeCategory !== 'ALL') {
        if (tourney.category !== activeCategory) return false;
      }

      // Squad filter
      if (activeSquadType !== 'ALL') {
        const sq = tourney.squadType?.toLowerCase() || '';
        if (activeSquadType === 'SOLO' && !sq.includes('solo')) return false;
        if (activeSquadType === 'DUO' && !sq.includes('duo')) return false;
        if (activeSquadType === 'SQUAD' && !sq.includes('squad')) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = tourney.title.toLowerCase().includes(q);
        const matchGame = tourney.game.toLowerCase().includes(q);
        const matchMap = (tourney.map || '').toLowerCase().includes(q);
        if (!matchTitle && !matchGame && !matchMap) return false;
      }

      return true;
    });
  }, [liveTournaments, activeCategory, activeSquadType, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-neutral-900 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-black text-white shadow-2xl border border-gold-primary text-xs font-semibold animate-fade-in">
          <span className="material-symbols-outlined text-gold-primary text-base">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="hover:text-black transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">home</span>
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-black font-bold">Tournaments &amp; Scrims Arena</span>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-gold-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>&larr; Back to Main Arena</span>
          </button>
        </div>
      </div>

      {/* Arena Hero Header */}
      <section className="bg-neutral-950 text-white border-b border-neutral-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-gold-primary/10 via-transparent to-transparent pointer-events-none opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-primary/15 text-gold-primary border border-gold-primary/30 text-[11px] font-mono font-bold uppercase tracking-widest">
                <span className="size-2 rounded-full bg-gold-primary animate-pulse"></span>
                Official Esports Hub
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
                Tournament &amp; Match Registrations
              </h1>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                Discover active tournament matches, enter competitive brackets across BGMI, PUBG Mobile, and Free Fire MAX, and receive instant custom room credentials directly on your dashboard.
              </p>
            </div>

            {/* Quick stats banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Total Prize Pool</span>
                <span className="text-lg font-black text-gold-primary font-mono block mt-0.5">₹ 9,50,000+</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Match Anti-Cheat</span>
                <span className="text-lg font-black text-emerald-400 font-mono block mt-0.5">100% Verified</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Host Format</span>
                <span className="text-lg font-black text-white font-mono block mt-0.5">Free &amp; Paid Slots</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter & Tournament Arena */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls Bar: Search & Category Filter Pills */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-sm space-y-4 mb-8">
          {/* Top row: Search and Squad Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
              <input
                type="text"
                placeholder="Search by tournament name, title, game, or map (e.g. BGMI, Erangel)..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 text-sm rounded-xl border border-gray-300 bg-white focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-hidden transition-all text-gray-900 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer text-sm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Squad Type Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">Format:</span>
              {['ALL', 'SQUAD', 'DUO', 'SOLO'].map((sq) => (
                <button
                  key={sq}
                  onClick={() => handleSquadChange(sq)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeSquadType === sq
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {sq === 'ALL' ? 'All Formats' : sq}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom row: Game Category Pills */}
          <div className="pt-3 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleCategoryChange('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'ALL'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>All Matches</span>
              <span className="text-[10px] opacity-75 font-mono">({liveTournaments.length})</span>
            </button>

            <button
              onClick={() => handleCategoryChange('BGMI')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'BGMI'
                  ? 'bg-gold-primary text-black shadow-sm font-extrabold'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>🎯 BGMI Showdowns</span>
            </button>

            <button
              onClick={() => handleCategoryChange('SCRIMS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'SCRIMS'
                  ? 'bg-orange-500 text-white shadow-sm font-extrabold'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>⚔️ Daily Scrims</span>
            </button>

            <button
              onClick={() => handleCategoryChange('PUBG')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'PUBG'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>🏆 PUBG Mobile</span>
            </button>

            <button
              onClick={() => handleCategoryChange('FREEFIRE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'FREEFIRE'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>⚡ Free Fire MAX</span>
            </button>

            <button
              onClick={() => handleCategoryChange('OTHER')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'OTHER'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>🎮 Tactical &amp; PC</span>
            </button>
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between pb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Showing <span className="text-black font-extrabold font-mono">{filteredTournaments.length}</span> Available Tournaments
          </p>

          {activeUser && (
            <button
              onClick={() => onNavigate && onNavigate('user-dashboard')}
              className="text-xs font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View My Active Matches</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          )}
        </div>

        {/* Tournament Cards Grid */}
        {isFiltering ? (
          <SkeletonLoader variant="tournament-card" count={4} />
        ) : filteredTournaments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200/80 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
              <span className="material-symbols-outlined text-3xl">sports_esports</span>
            </div>
            {liveTournaments.length === 0 ? (
              <>
                <h3 className="text-lg font-black uppercase tracking-wider text-black">No Live Tournaments or Scrims Active Right Now</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Only authentic organizer-hosted tournaments appear here. Organize and host your own BGMI, PUBG, or Free Fire tournament room with real custom match-day keys &amp; instant live brackets!
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => onNavigate && onNavigate('user-dashboard')}
                    className="px-5 py-2.5 rounded-xl bg-gold-primary text-black text-xs font-black uppercase tracking-wider hover:bg-gold-secondary shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    <span>Host Tournament Room (₹10)</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-800">No Tournaments Match Your Filter</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try adjusting your game category, squad format, or search keywords to find open competitive lobbies.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('ALL');
                    setActiveSquadType('ALL');
                    setSearchQuery('');
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gold-primary hover:text-black transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 pt-2 pb-6">
            {filteredTournaments.map((tourney) => {
              const isRegistered = joinedTourneyIds.has(tourney.id) || joinedTourneyIds.has(tourney.title);

              return (
                <div
                  key={tourney.id}
                  onClick={() => setSpotlightTourney(tourney)}
                  className={`group relative flex flex-col rounded-2xl bg-white shadow-md hover:shadow-2xl hover:shadow-black/25 transition-all duration-300 ease-out border overflow-hidden cursor-pointer transform-gpu will-change-transform hover:-translate-y-2 hover:scale-[1.025] relative z-0 hover:z-30 hover:border-gold-primary hover:ring-2 hover:ring-gold-primary/50 ${
                    isRegistered ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-black/10'
                  }`}
                >
                  {/* Image Banner with Smooth Hover Zoom & Forward Elevation */}
                  <div className="relative aspect-[1.74/1] w-full overflow-hidden bg-neutral-900">
                    <img
                      alt={tourney.title}
                      loading="lazy"
                      width="462"
                      height="266"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108 group-hover:brightness-105 transform-gpu"
                      src={tourney.image}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* Clean Content: Title, Timing, Free/Paid Status & Prize Pool */}
                  <div className="flex flex-col justify-between flex-1 p-4 lg:p-5 gap-3.5">
                    <div>
                      <h3 className="primary-bold-s16-lh120 text-dark-default uppercase group-hover:text-gold-primary transition-colors duration-200 line-clamp-1">
                        {tourney.title}
                      </h3>
                      {/* Match Timing & Free/Paid Status (Below Title) */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 font-mono mt-1.5">
                        <span className="flex items-center gap-1 font-semibold text-gray-700">
                          <span className="material-symbols-outlined text-[13px] text-gold-primary">schedule</span>
                          <span>{tourney.schedule}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          {tourney.entryFee || 'FREE ENTRY'}
                        </span>
                      </div>
                    </div>

                    {/* Prize Pool & Registration Action Button */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Prize Pool</span>
                        <span className="text-sm font-extrabold text-black group-hover:text-gold-primary transition-colors font-mono">{tourney.prizePool}</span>
                      </div>

                      {isRegistered ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onNavigate) onNavigate('user-dashboard');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span>Slot Active ✓</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onNavigate) {
                              onNavigate('tournament-register', tourney);
                            } else {
                              handleOpenRegister(tourney);
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-black text-white group-hover:bg-gold-primary group-hover:text-black text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xs cursor-pointer flex items-center gap-1 group-hover:shadow-md"
                        >
                          <span>Register Match</span>
                          <span className="material-symbols-outlined text-[14px]">how_to_reg</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL 1: AUTH REQUIRED NOTICE (Only Sign-In Players)
          ======================================================== */}
      {showAuthModal && (
        <div 
          onClick={handleCloseAuthModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 overflow-hidden text-center p-6 space-y-4"
          >
            {/* Top-right close button that closes cleanly without redirection */}
            <button
              type="button"
              onClick={handleCloseAuthModal}
              className="absolute top-4 right-4 size-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="size-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl shadow-xs">
              <span className="material-symbols-outlined text-[32px]">lock</span>
            </div>

            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gold-primary/20 text-black border border-gold-primary/40">
                Official Match Policy
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                Sign In Required to Register
              </h3>
              <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                Only signed-in players can register for official competitive matches and receive custom room credentials.
              </p>
            </div>

            {selectedTourney && (
              <div className="bg-neutral-50 p-3 rounded-xl border border-gray-200 text-left flex items-center gap-3">
                <img
                  src={selectedTourney.image}
                  alt={selectedTourney.title}
                  className="size-12 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{selectedTourney.title}</h4>
                  <p className="text-[10px] text-gold-primary font-bold uppercase">{selectedTourney.game}</p>
                  <p className="text-[10px] text-gray-500">{selectedTourney.schedule}</p>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  setSelectedTourney(null);
                  if (onNavigate) onNavigate('login');
                }}
                className="w-full py-3 rounded-xl bg-black hover:bg-gold-primary hover:text-black text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>Sign In to Register</span>
                <span className="material-symbols-outlined text-[16px]">login</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  setSelectedTourney(null);
                  if (onNavigate) onNavigate('register');
                }}
                className="w-full py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Create New Player Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: MATCH REGISTRATION FOR SIGNED-IN PLAYERS
          ======================================================== */}
      {selectedTourney && !showAuthModal && (
        <div 
          onClick={handleCloseRegistrationModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 bg-neutral-900 text-white flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-gold-primary text-black">
                  Match Entry Arena
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {regSuccessData ? 'Registration Confirmed!' : 'Register for Tournament'}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseRegistrationModal}
                className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {regSuccessData ? (
                <div className="space-y-4 text-center py-2">
                  <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Your Squad is Registered!</h4>
                  <p className="text-gray-600 text-xs">
                    Your spot for <strong>{regSuccessData.title}</strong> has been secured. Custom room credentials will be delivered before match start.
                  </p>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-gray-200 text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Registration ID:</span>
                      <span className="font-mono font-bold text-black">{regSuccessData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Squad Name:</span>
                      <span className="font-bold text-black">{regSuccessData.squadName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Leader IGN:</span>
                      <span className="font-bold text-black">{regSuccessData.leaderIgn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Assigned Slot:</span>
                      <span className="font-bold text-emerald-600 font-mono">Slot #{regSuccessData.roomCredentials.slotNumber}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => {
                        handleCloseRegistrationModal();
                        if (onNavigate) onNavigate('user-dashboard');
                      }}
                      className="flex-1 py-3 rounded-xl bg-gold-primary hover:bg-gold-light text-black font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer shadow-md"
                    >
                      Open Competitor Dashboard &rarr;
                    </button>
                    <button
                      onClick={handleCloseRegistrationModal}
                      className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitRegistration} className="space-y-4">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <img
                      src={selectedTourney.image}
                      alt={selectedTourney.title}
                      className="size-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{selectedTourney.title}</h4>
                      <p className="text-[10px] text-gray-500">{selectedTourney.schedule} • {selectedTourney.prizePool}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Squad / Clan Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Squad / Clan Name"
                        value={squadName}
                        onChange={(e) => setSquadName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-gold-primary focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Leader In-Game Name (IGN) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Username"
                          value={leaderIgn}
                          onChange={(e) => setLeaderIgn(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-gold-primary focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                          In-Game Character ID *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Character ID"
                          value={characterId}
                          onChange={(e) => setCharacterId(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-gold-primary focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        WhatsApp Contact (For Room ID &amp; Password)
                      </label>
                      <input
                        type="tel"
                        placeholder="WhatsApp / Phone"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-gold-primary focus:outline-hidden font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Teammates In-Game Names (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Player 2 IGN, Player 3 IGN, Player 4 IGN"
                        value={teammates}
                        onChange={(e) => setTeammates(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-gold-primary focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCloseRegistrationModal}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
                    >
                      Close
                    </button>

                    <ButtonLoader
                      type="submit"
                      loading={isRegistering}
                      loadingText="Securing Slot..."
                      variant="gold"
                      className="px-6 py-2.5 text-xs font-bold"
                    >
                      Confirm Match Registration
                    </ButtonLoader>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Previous Finished Matches & 25-Slot Leaderboards */}
      <div className="mt-12">
        <PreviousFinishedMatchesSection onNavigate={onNavigate} currentUser={currentUser} />
      </div>

      {/* 3D Interactive Glossy Card Spotlight Modal */}
      <InteractiveTournamentSpotlight
        tourney={spotlightTourney}
        onClose={() => setSpotlightTourney(null)}
        onRegister={(tourney) => {
          setSpotlightTourney(null);
          if (onNavigate) {
            onNavigate('tournament-register', tourney);
          } else {
            handleOpenRegister(tourney);
          }
        }}
        onNavigate={onNavigate}
        isRegistered={spotlightTourney && (joinedTourneyIds.has(spotlightTourney.id) || joinedTourneyIds.has(spotlightTourney.title))}
      />

    </div>
  );
}
