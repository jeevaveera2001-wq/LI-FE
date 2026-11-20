import React, { useState, useEffect } from 'react';

const INITIAL_TOURNAMENTS = [
  {
    id: 'bgmi-showdown-reg',
    title: 'BGMI SHOWDOWN TOURNAMENT',
    game: 'BATTLEGROUNDS MOBILE INDIA',
    category: 'BGMI',
    badge: '🔥 REGISTRATION OPEN',
    badgeColor: 'bg-amber-500 text-black font-extrabold',
    schedule: 'Starts Today • 7:00 PM IST',
    prizePool: '₹ 1,50,000 INR',
    format: 'Squad (Erangel + Miramar)',
    entryFee: 'FREE ENTRY',
    image: '/assets/tournament_bgmi_showdown_4k.jpg',
    description: 'Premier Indian battle royale squad championship. Instant custom room credentials and referee oversight upon registration.'
  },
  {
    id: 'pubg-mobile-global-reg',
    title: 'PUBG MOBILE GLOBAL CHAMPIONSHIP',
    game: 'PUBG MOBILE',
    category: 'PUBG',
    badge: '⭐ PREMIER REGISTRATION',
    badgeColor: 'bg-[#DFBD78] text-black font-extrabold shadow-sm',
    schedule: 'Starts in 2 Days • 8:00 PM IST',
    prizePool: '₹ 5,00,000 INR',
    format: 'Squad Pro Tournament (Erangel + Sanhok)',
    entryFee: 'FREE ENTRY',
    image: '/assets/tournament_pubg_mobile_4k.jpg',
    description: 'Tier-1 competitive international championship. Verified squad rosters with automated match scoring and leaderboard tracking.'
  },
  {
    id: 'bgmi-lan-warriors-reg',
    title: 'BGMI LAN WARRIORS CHALLENGE',
    game: 'BATTLEGROUNDS MOBILE INDIA',
    category: 'BGMI',
    badge: '⚡ SQUAD MATCH OPEN',
    badgeColor: 'bg-emerald-600 text-white font-extrabold',
    schedule: 'Starts Tomorrow • 5:00 PM IST',
    prizePool: '₹ 75,000 INR',
    format: 'Squad Tactical Showdown (Miramar)',
    entryFee: 'FREE ENTRY',
    image: '/assets/tournament_bgmi_lan_warriors_4k.jpg',
    description: 'Clash of top underdog and elite squads in custom rooms. Fair play anti-cheat verified with direct prize distribution.'
  },
  {
    id: 'pubg-ultimate-squad-reg',
    title: 'PUBG ULTIMATE SQUAD SERIES',
    game: 'PUBG MOBILE',
    category: 'PUBG',
    badge: '🎯 SQUAD ENTRY LIVE',
    badgeColor: 'bg-blue-600 text-white font-extrabold',
    schedule: 'Starts Tomorrow • 6:00 PM IST',
    prizePool: '₹ 30,000 INR',
    format: 'Squad Battle Royale (Vikendi + Erangel)',
    entryFee: 'FREE ENTRY',
    image: '/assets/tournament_pubg_ultimate_squad_4k.jpg',
    description: 'High-octane daily competitive series. Custom room credentials and automated rankings for all verified squad leaders.'
  },
  {
    id: 'freefire-clutch-cup-reg',
    title: 'FREE FIRE MAX CLUTCH MASTERS',
    game: 'FREE FIRE MAX',
    category: 'FREEFIRE',
    badge: '🎯 OPEN REGISTRATION',
    badgeColor: 'bg-indigo-600 text-white font-extrabold',
    schedule: 'Starts Saturday • 4:00 PM IST',
    prizePool: '₹ 50,000 INR',
    format: 'Squad Clash (Bermuda + Purgatory)',
    entryFee: 'FREE ENTRY',
    image: '/assets/tournament_bgmi_showdown_4k.jpg',
    description: 'Rapid-fire Free Fire MAX squad cup with custom clash maps, automated lobby points, and live referee validation.'
  },
  {
    id: 'valorant-spike-masters-reg',
    title: 'VALORANT MUMBAI SPIKE LEAGUE',
    game: 'VALORANT',
    category: 'OTHER',
    badge: '🏆 5v5 SQUAD OPEN',
    badgeColor: 'bg-purple-600 text-white font-extrabold',
    schedule: 'Starts Sunday • 6:00 PM IST',
    prizePool: '₹ 1,00,000 INR',
    format: '5v5 Tactical Shooter (Ascent & Bind)',
    entryFee: 'FREE ENTRY',
    image: '/assets/tournament_bgmi_lan_warriors_4k.jpg',
    description: 'Competitive tactical PC showdown hosted on Mumbai low-latency dedicated tournament servers.'
  },
  {
    id: 'codm-battle-royale-reg',
    title: 'COD MOBILE BATTLE ROYALE CUP',
    game: 'CALL OF DUTY: MOBILE',
    category: 'OTHER',
    badge: '🔥 REGISTRATION OPEN',
    badgeColor: 'bg-amber-600 text-white font-extrabold',
    schedule: 'Starts Sunday • 8:00 PM IST',
    prizePool: '₹ 40,000 INR',
    format: 'Squad Battle Royale (Isolated Map)',
    entryFee: 'FREE ENTRY',
    image: '/assets/tournament_pubg_mobile_4k.jpg',
    description: 'Mobile battle royale showdown featuring customized weapon loadouts, automated kill feeds, and instant rankings.'
  },
  {
    id: 'bgmi-underdog-pro-reg',
    title: 'BGMI UNDERDOG PRO RUMBLE',
    game: 'BATTLEGROUNDS MOBILE INDIA',
    category: 'BGMI',
    badge: '⭐ VERIFIED SQUAD CUP',
    badgeColor: 'bg-[#DFBD78] text-black font-extrabold',
    schedule: 'Starts Monday • 7:30 PM IST',
    prizePool: '₹ 60,000 INR',
    format: 'Squad 4-Map Championship Rotation',
    entryFee: 'FREE ENTRY',
    image: '/assets/tournament_pubg_ultimate_squad_4k.jpg',
    description: 'Platform dedicated for rising underdog clans and content creators to establish their competitive ranking.'
  }
];

export default function FeaturedTournamentsSection({ onNavigate, currentUser }) {
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, BGMI, PUBG, FREEFIRE, OTHER
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllTournaments, setShowAllTournaments] = useState(false);

  // Helper to get active logged-in user
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

  // Track joined tournaments from localStorage
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

  // Sync registered tournaments dynamically
  useEffect(() => {
    const syncJoined = () => {
      try {
        const saved = localStorage.getItem('lt_user_joined_tourneys');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setJoinedTourneyIds(new Set(parsed.map(t => t.id || t.tourneyId || t.title)));
          }
        }
      } catch (e) {}
    };
    window.addEventListener('storage', syncJoined);
    return () => window.removeEventListener('storage', syncJoined);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Close Auth Required modal and dismiss selection completely
  const handleCloseAuthModal = (e) => {
    if (e) e.stopPropagation();
    setShowAuthModal(false);
    setSelectedTourney(null);
  };

  // Close Match Registration modal and dismiss selection completely
  const handleCloseRegistrationModal = (e) => {
    if (e) e.stopPropagation();
    setSelectedTourney(null);
    setRegSuccessData(null);
  };

  // Open Registration Modal with strict Sign-In verification
  const handleOpenRegister = (tourney) => {
    const activeUser = getActiveUser();

    // STRICT CHECK: Only signed-in players can register for a match
    if (!activeUser) {
      setSelectedTourney(tourney);
      setShowAuthModal(true);
      return;
    }

    // If already registered, take to Competitor Dashboard
    if (joinedTourneyIds.has(tourney.id) || joinedTourneyIds.has(tourney.title)) {
      showToast(`✓ You are already registered for ${tourney.title}. Opening your Dashboard...`);
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
    if (!selectedTourney) return;

    const activeUser = getActiveUser();
    if (!activeUser) {
      setShowAuthModal(true);
      return;
    }

    if (!squadName.trim()) {
      showToast('Please enter your Squad or Clan name');
      return;
    }
    if (!leaderIgn.trim()) {
      showToast('Please enter your Leader In-Game Name (IGN)');
      return;
    }

    setIsRegistering(true);

    try {
      // Generate authentic match room credentials
      const roomCode = 'LT-' + Math.floor(10000 + Math.random() * 90000);
      const roomPass = 'PASS' + Math.floor(100 + Math.random() * 900);
      const regId = 'reg_' + Date.now();

      const newJoinedEntry = {
        id: regId,
        tourneyId: selectedTourney.id,
        title: selectedTourney.title,
        game: selectedTourney.game,
        format: selectedTourney.format,
        date: selectedTourney.schedule.split('•')[0]?.replace('Starts ', '').trim() || 'Today',
        time: selectedTourney.schedule.split('•')[1]?.trim() || '7:00 PM IST',
        slotNumber: `Squad (${squadName.trim()})`,
        status: 'CONFIRMED',
        roomCode: roomCode,
        roomPass: roomPass,
        prizePool: selectedTourney.prizePool,
        thumbnail: selectedTourney.image,
        leader: leaderIgn.trim(),
        characterId: characterId.trim() || 'N/A',
        whatsapp: whatsappNumber.trim() || activeUser.mobile || 'Registered Player',
        registeredAt: new Date().toISOString()
      };

      // 1. Save to user joined tournaments in localStorage
      const existingRaw = localStorage.getItem('lt_user_joined_tourneys');
      const existingList = existingRaw ? JSON.parse(existingRaw) : [];
      const updatedList = [newJoinedEntry, ...existingList];
      localStorage.setItem('lt_user_joined_tourneys', JSON.stringify(updatedList));

      // 2. Update local state
      setJoinedTourneyIds(prev => new Set([...prev, selectedTourney.id, selectedTourney.title]));

      // 3. Log activity to MongoDB via API for Super Admin tracking
      try {
        await fetch('/api/admin/activity-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: activeUser.userId || activeUser.email || 'PLAYER',
            action: 'MATCH_REGISTRATION',
            details: `Player "${activeUser.username || activeUser.name}" registered squad "${squadName}" for ${selectedTourney.title}`,
            ipAddress: '106.51.78.200',
            location: 'India'
          })
        });
      } catch (err) {}

      // Set success view
      setRegSuccessData(newJoinedEntry);
      showToast('🎉 Match Registration Confirmed!');
    } catch (err) {
      console.error('Registration failed:', err);
      showToast('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  // Filter tournaments
  const filteredTournaments = INITIAL_TOURNAMENTS.filter(t => {
    // Search query matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchGame = t.game.toLowerCase().includes(q);
      const matchFormat = t.format.toLowerCase().includes(q);
      if (!matchTitle && !matchGame && !matchFormat) return false;
    }

    // Category filter
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'BGMI') return t.category === 'BGMI';
    if (activeFilter === 'PUBG') return t.category === 'PUBG';
    if (activeFilter === 'FREEFIRE') return t.category === 'FREEFIRE';
    if (activeFilter === 'OTHER') return t.category === 'OTHER';
    return true;
  });

  // Decide how many to display
  const displayedTournaments = showAllTournaments
    ? filteredTournaments
    : filteredTournaments.slice(0, 4);

  const activeUser = getActiveUser();

  return (
    <section
      id="tournaments-section"
      data-section="play"
      className="relative block-default-horizontal-spacing block-default-vertical-spacing scroll-mt-20 bg-neutral-50/60"
    >
      {/* Anchor for direct #play link support */}
      <span id="play" className="absolute -top-24 block invisible pointer-events-none" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#111217] text-white text-xs font-bold border border-gold-primary/40 shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[16px] text-gold-primary">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="block-default-content-width mx-auto">
        <div className="relative flex flex-col gap-6 md:gap-8">
          
          {/* Header Title & Subtitle */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="text-dark-default section-title flex w-full flex-col gap-2 text-left">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-primary/20 text-black border border-gold-primary/40">
                  <span className="material-symbols-outlined text-[16px] text-gold-primary">how_to_reg</span>
                  Match Registration Arena
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  ● Match Entries Open
                </span>
              </div>
              <h2 className="primary-bold-s26-lh110 md:primary-bold-s32-lh100 lg:primary-bold-s38-lh100 xl:primary-bold-s42-lh90">
                Tournament Match Registrations
              </h2>
              <p className="primary-regular-s14-lh120 md:primary-regular-s18-lh120 lg:primary-regular-s20-lh120 text-[#6B7280]">
                Sign in to register your squad for upcoming competitive tournaments and explore active championship brackets.
              </p>
            </div>

            {/* Quick Action Link to Dashboard / Sign In */}
            <div className="hidden lg:flex items-center gap-3 text-black shrink-0">
              <div className="h-px w-[60px] bg-black/20"></div>
              {activeUser ? (
                <button
                  onClick={() => onNavigate && onNavigate('user-dashboard')}
                  className="primary-bold-s12-lh120 whitespace-nowrap uppercase tracking-wider hover:text-gold-primary flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>MY REGISTERED MATCHES</span>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-3 rtl:rotate-180" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M15.5 5H11l5 7-5 7h4.5l5-7z"></path>
                    <path d="M8.5 5H4l5 7-5 7h4.5l5-7z"></path>
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate && onNavigate('login')}
                  className="primary-bold-s12-lh120 whitespace-nowrap uppercase tracking-wider hover:text-gold-primary flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>SIGN IN TO REGISTER</span>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-3 rtl:rotate-180" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M15.5 5H11l5 7-5 7h4.5l5-7z"></path>
                    <path d="M8.5 5H4l5 7-5 7h4.5l5-7z"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Search & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeFilter === 'ALL'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">app_registration</span>
                <span>All Open Matches ({INITIAL_TOURNAMENTS.length})</span>
              </button>

              <button
                onClick={() => setActiveFilter('BGMI')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeFilter === 'BGMI'
                    ? 'bg-gold-primary text-black shadow-md font-extrabold'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <span>🎯</span>
                <span>BGMI Showdowns</span>
              </button>

              <button
                onClick={() => setActiveFilter('PUBG')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeFilter === 'PUBG'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <span>🏆</span>
                <span>PUBG Mobile</span>
              </button>

              <button
                onClick={() => setActiveFilter('FREEFIRE')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeFilter === 'FREEFIRE'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <span>⚡</span>
                <span>Free Fire MAX</span>
              </button>

              <button
                onClick={() => setActiveFilter('OTHER')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeFilter === 'OTHER'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <span>🎮</span>
                <span>Tactical &amp; PC</span>
              </button>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full md:w-64 shrink-0">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 bg-white focus:border-gold-primary focus:outline-hidden transition-colors font-medium text-gray-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Tournament Cards Grid (NO slot limitations) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {displayedTournaments.map((tourney) => {
              const isRegistered = joinedTourneyIds.has(tourney.id) || joinedTourneyIds.has(tourney.title);

              return (
                <div
                  key={tourney.id}
                  onClick={() => handleOpenRegister(tourney)}
                  className={`group flex flex-col rounded-2xl bg-white shadow-md hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 ease-out border overflow-hidden cursor-pointer transform hover:-translate-y-2 hover:border-gold-primary/70 hover:ring-2 hover:ring-gold-primary/30 ${
                    isRegistered ? 'border-emerald-500/80 ring-2 ring-emerald-500/20' : 'border-black/10'
                  }`}
                >
                  {/* Image Banner */}
                  <div className="relative aspect-[1.74/1] w-full overflow-hidden bg-neutral-900">
                    <img
                      alt={tourney.title}
                      loading="lazy"
                      width="462"
                      height="266"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      src={tourney.image}
                    />

                    {/* Top Floating Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {isRegistered ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow bg-emerald-600 text-white flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                          REGISTERED ✓
                        </span>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow ${tourney.badgeColor}`}>
                          {tourney.badge}
                        </span>
                      )}
                    </div>

                    {/* Schedule / Match Timing Bar */}
                    <div className="absolute bottom-2.5 right-3 bg-black/85 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-mono font-bold text-white/95 flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[13px] text-gold-primary">schedule</span>
                      <span>{tourney.schedule}</span>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="flex flex-col justify-between flex-1 p-4 lg:p-5 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gold-primary">
                          {tourney.game}
                        </p>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {tourney.entryFee}
                        </span>
                      </div>

                      <h3 className="primary-bold-s16-lh120 text-dark-default uppercase group-hover:text-gold-primary transition-colors line-clamp-1">
                        {tourney.title}
                      </h3>
                      <p className="text-[11px] text-[#6B7280] line-clamp-2 leading-relaxed">
                        {tourney.description}
                      </p>

                      {/* Match Format & Verification Specs (Clean layout, NO slot limitations) */}
                      <div className="mt-1 space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[15px] text-gold-primary">military_tech</span>
                            {tourney.format}
                          </span>
                          <span className="font-mono font-bold text-emerald-600 flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Open Match
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-blue-500">verified</span>
                            Anti-Cheat Verified
                          </span>
                          <span className="font-mono text-gray-700">Custom Room Match</span>
                        </div>
                      </div>
                    </div>

                    {/* Prize Pool & Registration Action Button */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Prize Pool</span>
                        <span className="text-sm font-extrabold text-black font-mono">{tourney.prizePool}</span>
                      </div>

                      {isRegistered ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onNavigate) onNavigate('user-dashboard');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                          <span>Slot Active ✓</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenRegister(tourney);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-black text-white group-hover:bg-gold-primary group-hover:text-black text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer flex items-center gap-1 group-hover:shadow-md"
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

          {/* Explore More Tournaments Action Strip */}
          <div className="mt-2 p-5 md:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm md:text-base font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
                <span className="material-symbols-outlined text-gold-primary text-[20px]">explore</span>
                <span>Explore More Tournaments &amp; Practice Scrims</span>
              </h4>
              <p className="text-xs text-gray-500 max-w-xl">
                Browse our daily tier-1 pro scrims, clan showdowns, partner championships, or host your own customized paid tournament.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setShowAllTournaments(prev => !prev)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {showAllTournaments ? 'expand_less' : 'expand_more'}
                </span>
                <span>{showAllTournaments ? 'Show Less' : `Explore All (${filteredTournaments.length} Tournaments)`}</span>
              </button>

              <button
                onClick={() => onNavigate && onNavigate(activeUser ? 'user-dashboard' : 'login')}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>{activeUser ? 'Competitor Hub' : 'Sign In to Play'}</span>
                <span className="material-symbols-outlined text-[16px] text-gold-primary">arrow_forward</span>
              </button>
            </div>
          </div>

        </div>
      </div>

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
            {/* Top-right close button */}
            <button
              type="button"
              onClick={handleCloseAuthModal}
              className="absolute top-4 right-4 size-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="size-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl shadow-sm">
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
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-gold-primary text-black">
                    {selectedTourney.category}
                  </span>
                  <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">
                    Official Squad Match Registration
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {selectedTourney.title}
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

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4">
              
              {regSuccessData ? (
                /* Registration Success State */
                <div className="text-center py-4 space-y-4 animate-fade-in">
                  <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900">Registration Confirmed! 🎉</h4>
                    <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto">
                      Your squad has been registered and verified for <strong className="text-gray-900">{regSuccessData.title}</strong>.
                    </p>
                  </div>

                  {/* Room Credential Card */}
                  <div className="bg-neutral-50 rounded-xl p-4 border border-gray-200 text-left space-y-2.5">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-xs text-gray-500 font-medium">Registered Squad:</span>
                      <span className="text-xs font-mono font-bold text-gray-900 bg-white px-2.5 py-0.5 rounded border border-gray-200">
                        {regSuccessData.slotNumber}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-xs text-gray-500 font-medium">Tournament Schedule:</span>
                      <span className="text-xs font-bold text-gray-900">
                        {regSuccessData.date} at {regSuccessData.time}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-xs text-gray-500 font-medium">Room ID:</span>
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        {regSuccessData.roomCode}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 font-medium">Password Status:</span>
                      <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Active in Competitor Dashboard
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500">
                    💡 You can review all tournament details and live room credentials inside your Competitor Dashboard.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        setSelectedTourney(null);
                        if (onNavigate) onNavigate('user-dashboard');
                      }}
                      className="w-full sm:flex-1 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Open My Dashboard</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTourney(null);
                        setRegSuccessData(null);
                      }}
                      className="w-full sm:flex-1 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Explore More Tournaments
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleSubmitRegistration} className="space-y-3.5">
                  
                  {/* Tournament Quick Specs */}
                  <div className="bg-neutral-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-bold">Prize Pool</span>
                      <span className="font-extrabold text-emerald-600 font-mono text-sm">{selectedTourney.prizePool}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500 block text-[10px] uppercase font-bold">Entry Fee</span>
                      <span className="font-bold text-gray-900">{selectedTourney.entryFee}</span>
                    </div>
                  </div>

                  {/* Signed-in Player Indicator */}
                  {activeUser && (
                    <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Verified Account: {activeUser.username || activeUser.name}
                      </span>
                      <span className="font-mono text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                        LOGGED IN
                      </span>
                    </div>
                  )}

                  {/* Field 1: Clan / Squad Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Squad / Clan Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Phoenix Esports, Team Delta"
                      value={squadName}
                      onChange={(e) => setSquadName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden text-gray-900 font-medium"
                    />
                  </div>

                  {/* Field 2 & 3: Leader IGN & Character ID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        Leader In-Game Name (IGN) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mortal_007"
                        value={leaderIgn}
                        onChange={(e) => setLeaderIgn(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden text-gray-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        Game Character ID (UID)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5123984102"
                        value={characterId}
                        onChange={(e) => setCharacterId(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden text-gray-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Field 4: WhatsApp Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      WhatsApp Number (For Instant Match Credentials &amp; Updates)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden text-gray-900 font-medium"
                    />
                  </div>

                  {/* Field 5: Teammate Rosters (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Teammate Roster IGNs (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Player2_IGN, Player3_IGN, Player4_IGN"
                      value={teammates}
                      onChange={(e) => setTeammates(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden text-gray-900 font-medium"
                    />
                    <span className="text-[10px] text-gray-500 mt-0.5 block">
                      Roster substitutions can also be configured inside your Competitor Dashboard.
                    </span>
                  </div>

                  {/* Compliance Notice */}
                  <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/60 text-[11px] text-blue-800 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px] text-blue-600 shrink-0 mt-0.5">verified_user</span>
                    <span>
                      Instant match entry with official room ID and password active on your profile. Free automated referee scoring and rank tracking.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isRegistering}
                      className="w-full py-3 rounded-xl bg-black hover:bg-gold-primary hover:text-black text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isRegistering ? (
                        <>
                          <span className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Confirming Match Registration...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm Squad Match Registration</span>
                          <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
