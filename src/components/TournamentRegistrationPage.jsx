import React, { useState, useEffect } from 'react';
import { ButtonLoader } from './loaders';

export default function TournamentRegistrationPage({ tourney, onNavigate, currentUser }) {
  // Retrieve default or active tournament
  const activeTourney = tourney || {
    id: 'bgmi-showdown-reg',
    title: 'BGMI SHOWDOWN TOURNAMENT',
    game: 'BATTLEGROUNDS MOBILE INDIA',
    category: 'BGMI',
    schedule: 'Starts Today • 7:00 PM IST',
    prizePool: '₹ 1,50,000 INR',
    squadType: 'Squad',
    format: 'Squad (Erangel + Miramar)',
    map: 'Erangel / Miramar',
    entryFee: 'FREE ENTRY',
    image: '/assets/tournament_bgmi_showdown_4k.jpg'
  };

  const isDuo = activeTourney.squadType?.toLowerCase() === 'duo' || activeTourney.format?.toLowerCase().includes('duo');
  const isSolo = activeTourney.squadType?.toLowerCase() === 'solo' || activeTourney.format?.toLowerCase().includes('solo');
  const isSquad = !isDuo && !isSolo;

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

  // Form State
  const [teamName, setTeamName] = useState(activeUser?.clan || '');
  const [whatsapp, setWhatsapp] = useState(activeUser?.mobile || '');
  const [deviceModel, setDeviceModel] = useState('');

  // Player fields
  const [p1Ign, setP1Ign] = useState(activeUser?.username || activeUser?.name || '');
  const [p1Uid, setP1Uid] = useState('');

  const [p2Ign, setP2Ign] = useState('');
  const [p2Uid, setP2Uid] = useState('');

  const [p3Ign, setP3Ign] = useState('');
  const [p3Uid, setP3Uid] = useState('');

  const [p4Ign, setP4Ign] = useState('');
  const [p4Uid, setP4Uid] = useState('');

  const [p5Ign, setP5Ign] = useState('');
  const [p5Uid, setP5Uid] = useState('');

  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(null);
  const [formError, setFormError] = useState('');

  // Check if user already registered for this tournament
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('lt_user_joined_tourneys');
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const found = list.some(t => t.id === activeTourney.id || t.tourneyId === activeTourney.id || t.title === activeTourney.title);
            if (found) setAlreadyRegistered(true);
          }
        }
      } catch (e) {}
    }
  }, [activeTourney]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!agreedTerms) {
      setFormError('Please accept the official tournament fair-play & anti-cheat terms.');
      return;
    }

    if (!whatsapp.trim()) {
      setFormError('Please provide a valid WhatsApp number for room ID and password dispatch.');
      return;
    }

    if (isSolo) {
      if (!p1Ign.trim() || !p1Uid.trim()) {
        setFormError('Please fill in your Player IGN and In-Game Character UID.');
        return;
      }
    } else if (isDuo) {
      if (!teamName.trim()) {
        setFormError('Please enter your Duo Team Name.');
        return;
      }
      if (!p1Ign.trim() || !p1Uid.trim() || !p2Ign.trim() || !p2Uid.trim()) {
        setFormError('Please enter details for both Duo players (Leader + Teammate).');
        return;
      }
    } else {
      // Squad: 4 required + 1 substitute optional
      if (!teamName.trim()) {
        setFormError('Please enter your Clan or Squad Name.');
        return;
      }
      if (!p1Ign.trim() || !p1Uid.trim() || !p2Ign.trim() || !p2Uid.trim() || !p3Ign.trim() || !p3Uid.trim() || !p4Ign.trim() || !p4Uid.trim()) {
        setFormError('Please provide details for all 4 primary Squad members.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Generate match credentials
      const roomCode = 'LT-' + Math.floor(10000 + Math.random() * 90000);
      const roomPass = 'PASS' + Math.floor(100 + Math.random() * 900);
      const regId = 'reg_' + Date.now();

      const playersList = [];
      if (isSolo) {
        playersList.push({ slot: 'Player 1 (Solo)', ign: p1Ign.trim(), uid: p1Uid.trim(), role: 'Competitor' });
      } else if (isDuo) {
        playersList.push({ slot: 'Player 1', ign: p1Ign.trim(), uid: p1Uid.trim(), role: 'Captain' });
        playersList.push({ slot: 'Player 2', ign: p2Ign.trim(), uid: p2Uid.trim(), role: 'Teammate' });
      } else {
        playersList.push({ slot: 'Player 1', ign: p1Ign.trim(), uid: p1Uid.trim(), role: 'Captain' });
        playersList.push({ slot: 'Player 2', ign: p2Ign.trim(), uid: p2Uid.trim(), role: 'Fragger' });
        playersList.push({ slot: 'Player 3', ign: p3Ign.trim(), uid: p3Uid.trim(), role: 'Support' });
        playersList.push({ slot: 'Player 4', ign: p4Ign.trim(), uid: p4Uid.trim(), role: 'Assaulter' });
        if (p5Ign.trim()) {
          playersList.push({ slot: 'Player 5 (Sub)', ign: p5Ign.trim(), uid: p5Uid.trim() || 'N/A', role: 'Substitute' });
        }
      }

      const newRegistration = {
        id: regId,
        tourneyId: activeTourney.id,
        title: activeTourney.title,
        game: activeTourney.game,
        format: activeTourney.format || activeTourney.squadType,
        date: activeTourney.schedule?.split('•')[0]?.replace('Starts ', '').trim() || 'Today',
        time: activeTourney.schedule?.split('•')[1]?.trim() || '7:00 PM IST',
        slotNumber: isSolo ? `Solo (${p1Ign.trim()})` : `${activeTourney.squadType} (${teamName.trim()})`,
        status: 'CONFIRMED',
        roomCode: roomCode,
        roomPass: roomPass,
        prizePool: activeTourney.prizePool,
        thumbnail: activeTourney.image,
        leader: p1Ign.trim(),
        characterId: p1Uid.trim() || 'N/A',
        whatsapp: whatsapp.trim(),
        players: playersList,
        registeredAt: new Date().toISOString()
      };

      // 1. Save to user joined tourneys
      const existingRaw = localStorage.getItem('lt_user_joined_tourneys');
      const existingList = existingRaw ? JSON.parse(existingRaw) : [];
      const updatedList = [newRegistration, ...existingList];
      localStorage.setItem('lt_user_joined_tourneys', JSON.stringify(updatedList));

      // 2. Sync to Super Admin Tournament Registrations Queue
      try {
        const adminRegsRaw = localStorage.getItem('lt_admin_tournament_registrations');
        const adminRegs = adminRegsRaw ? JSON.parse(adminRegsRaw) : [];
        localStorage.setItem('lt_admin_tournament_registrations', JSON.stringify([newRegistration, ...adminRegs.filter(r => r.id !== newRegistration.id)]));
      } catch (e) {}

      // 3. Sync to Super Admin Activity Logs
      try {
        const adminLogsRaw = localStorage.getItem('lt_admin_activity_logs');
        const adminLogs = adminLogsRaw ? JSON.parse(adminLogsRaw) : [];
        const newLog = {
          id: 'log_' + Date.now(),
          user: activeUser?.username || activeUser?.name || p1Ign || 'Competitor',
          userName: activeUser?.name || p1Ign || 'Competitor',
          userEmail: activeUser?.email || `${whatsapp.trim()}@sms.in`,
          action: 'Player Tournament Registration',
          details: `Registered ${isSolo ? 'Solo Player' : teamName} (${activeTourney.squadType}) for ${activeTourney.title}`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
          ipAddress: '106.51.78.200',
          location: 'India'
        };
        localStorage.setItem('lt_admin_activity_logs', JSON.stringify([newLog, ...adminLogs]));
      } catch (e) {}

      // 4. Dispatch storage and real-time event for live tabs
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('lt_registration_submitted'));

      // 3. Post audit log
      try {
        await fetch('/api/admin/activity-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: activeUser?.userId || activeUser?.email || 'PLAYER',
            action: 'FULL_PAGE_MATCH_REGISTRATION',
            details: `Registered ${isSolo ? 'Solo Player' : teamName} (${activeTourney.squadType}) for ${activeTourney.title}`,
            ipAddress: '106.51.78.200',
            location: 'India'
          })
        });
      } catch (err) {}

      setRegSuccess(newRegistration);
      setAlreadyRegistered(true);
    } catch (err) {
      console.error('Registration failed:', err);
      setFormError('Failed to complete registration. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-gray-900 pb-20">
      
      {/* Top Header Breadcrumb Bar */}
      <div className="bg-[#111217] text-white border-b border-white/10 py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate && onNavigate('tournaments')}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-gold-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to All Tournaments</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span className="text-gold-primary font-bold">MATCH REGISTRATION PORTAL</span>
            <span>&bull;</span>
            <span className="text-white">{activeTourney.category}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Page Title & Status */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold-primary text-black">
              Official Match Registration
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black text-white">
              {isSolo ? '1-Player Solo Match' : isDuo ? '2-Player Duo Showdown' : '4-Player Squad + 1 Substitute'}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
              {activeTourney.entryFee || 'FREE ENTRY'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-gray-900">
            {activeTourney.title}
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            Complete official roster registration for your team. Match room ID and credentials will activate directly on your dashboard upon confirmation.
          </p>
        </div>

        {/* 2-Column Full-Page Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =========================================================
              LEFT COLUMN: Tournament Card Section (Bigger, High-Res Image, Details)
              ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#111217] rounded-3xl overflow-hidden border border-white/10 hover:border-gold-primary/50 shadow-2xl text-white group transition-all duration-300 ease-out hover:shadow-gold-primary/10">
              
              {/* High-Res Tournament Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                <img
                  src={activeTourney.image}
                  alt={activeTourney.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108 group-hover:brightness-105 transform-gpu"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#111217] via-transparent to-transparent"></div>

                {/* Prize Pool Tag */}
                <div className="absolute bottom-4 right-4 bg-black/85 backdrop-blur-md border border-gold-primary/60 rounded-xl px-3.5 py-1.5 text-right shadow-xl">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-gold-primary font-bold block">
                    Prize Pool
                  </span>
                  <span className="text-base sm:text-lg font-black text-white font-mono">
                    {activeTourney.prizePool}
                  </span>
                </div>
              </div>

              {/* Tournament Specs Summary Card */}
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gold-primary">
                    {activeTourney.game}
                  </span>
                  <h3 className="text-lg font-bold text-white uppercase mt-0.5">
                    {activeTourney.title}
                  </h3>
                </div>

                {/* Match Specs Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                    <span className="text-gray-400 block text-[10px] uppercase font-sans font-bold">Schedule</span>
                    <span className="text-white font-bold block mt-0.5">{activeTourney.schedule}</span>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                    <span className="text-gray-400 block text-[10px] uppercase font-sans font-bold">Map / Arena</span>
                    <span className="text-white font-bold block mt-0.5">{activeTourney.map || 'Erangel / Miramar'}</span>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                    <span className="text-gray-400 block text-[10px] uppercase font-sans font-bold">Entry Fee</span>
                    <span className="text-emerald-400 font-bold block mt-0.5">{activeTourney.entryFee || 'FREE ENTRY'}</span>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                    <span className="text-gray-400 block text-[10px] uppercase font-sans font-bold">Format</span>
                    <span className="text-gold-primary font-bold block mt-0.5">{activeTourney.format || activeTourney.squadType}</span>
                  </div>
                </div>

                {/* Tournament Rules / Policy Brief */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-xs text-gray-300 space-y-2.5">
                  <h4 className="font-bold uppercase tracking-wider text-white text-[11px] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-gold-primary">gavel</span>
                    <span>Official Match Rules</span>
                  </h4>
                  <ul className="space-y-1.5 text-[11px] text-gray-400 list-disc list-inside">
                    <li>Smartphones only (No emulators, iPads, or physical triggers).</li>
                    <li>Official BGIS / PMGC points scoring system active.</li>
                    <li>Room ID &amp; Password posted 15 minutes before match start.</li>
                    <li>Players must join their allotted team slots only.</li>
                  </ul>
                </div>

              </div>

            </div>

            {/* Quick Helper Links */}
            <div className="p-4 bg-white rounded-2xl border border-gray-200/90 text-xs text-gray-600 flex items-center justify-between">
              <span className="font-medium">Need tournament assistance?</span>
              <button
                onClick={() => onNavigate && onNavigate('about')}
                className="font-bold text-black hover:text-gold-primary transition-colors uppercase tracking-wider"
              >
                Help &amp; FAQ &rarr;
              </button>
            </div>

          </div>

          {/* =========================================================
              RIGHT COLUMN: Roster & Details Registration Form
              ========================================================= */}
          <div className="lg:col-span-7">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6">
              
              {regSuccess ? (
                /* ===================================================
                   SUCCESS SCREEN
                   =================================================== */
                <div className="text-center py-6 space-y-6 animate-fade-in">
                  <div className="size-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-4xl shadow-inner">
                    ✓
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase">
                      Match Registration Confirmed!
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 max-w-md mx-auto">
                      Your team has been successfully entered into <strong className="text-gray-900">{regSuccess.title}</strong>.
                    </p>
                  </div>

                  {/* Room Credentials Card */}
                  <div className="bg-neutral-900 text-white rounded-2xl p-6 border border-white/10 text-left max-w-lg mx-auto space-y-3 shadow-xl">
                    <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                      <span className="text-xs text-gray-400 uppercase font-mono">Registered Entry:</span>
                      <span className="text-xs font-mono font-bold text-gold-primary bg-white/10 px-3 py-1 rounded">
                        {regSuccess.slotNumber}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                      <span className="text-xs text-gray-400 uppercase font-mono">Match Time:</span>
                      <span className="text-xs font-bold text-white font-mono">
                        {regSuccess.date} • {regSuccess.time}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                      <span className="text-xs text-gray-400 uppercase font-mono">Custom Room Code:</span>
                      <span className="text-sm font-mono font-black text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-3 py-0.5 rounded">
                        {regSuccess.roomCode}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 uppercase font-mono">Password Delivery:</span>
                      <span className="text-xs font-bold text-amber-400 bg-amber-950/50 px-2.5 py-0.5 rounded border border-amber-500/30">
                        Dispatched via WhatsApp + Active in Dashboard
                      </span>
                    </div>
                  </div>

                  {/* Registered Roster Breakdown */}
                  {regSuccess.players && regSuccess.players.length > 0 && (
                    <div className="max-w-lg mx-auto text-left bg-gray-50 rounded-2xl p-4 border border-gray-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
                        Confirmed Roster ({regSuccess.players.length} Players):
                      </span>
                      <div className="space-y-1.5">
                        {regSuccess.players.map((p, idx) => (
                          <div key={idx} className="flex justify-between text-xs font-mono py-1 border-b border-gray-200/60 last:border-0">
                            <span className="font-semibold text-gray-800">{p.slot} ({p.role}):</span>
                            <span className="text-gray-600">{p.ign} <span className="text-gray-400 font-normal">[UID: {p.uid}]</span></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-3">
                    <button
                      onClick={() => onNavigate && onNavigate('user-dashboard')}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Open Competitor Dashboard</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>

                    <button
                      onClick={() => onNavigate && onNavigate('tournaments')}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Browse More Tournaments
                    </button>
                  </div>
                </div>
              ) : (
                /* ===================================================
                   ACTIVE REGISTRATION FORM
                   =================================================== */
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Signed-in Player Indicator */}
                  {activeUser ? (
                    <div className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                      <span className="flex items-center gap-2 font-semibold">
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Verified Account: <strong className="text-emerald-900">{activeUser.username || activeUser.name}</strong>
                      </span>
                      <span className="font-mono text-[10px] bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded font-bold uppercase">
                        LOGGED IN
                      </span>
                    </div>
                  ) : (
                    <div className="px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                      <span>Sign in to automatically sync match statistics to your Competitor Profile.</span>
                      <button
                        type="button"
                        onClick={() => onNavigate && onNavigate('login')}
                        className="font-bold underline text-amber-900 hover:text-black uppercase text-[11px]"
                      >
                        Sign In Now
                      </button>
                    </div>
                  )}

                  {/* Form Error Banner */}
                  {formError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Section 1: Team & Contact Info */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-1 border-b border-gray-100">
                      1. General Team &amp; Notification Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {!isSolo && (
                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            {isDuo ? 'Duo Team Name' : 'Squad / Clan Name'} <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder={isDuo ? 'e.g. Duo Delta' : 'e.g. Phoenix Esports, Team Soul'}
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden font-medium text-gray-900"
                          />
                        </div>
                      )}

                      <div className={isSolo ? 'sm:col-span-2' : ''}>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          WhatsApp Contact Number (For Room ID &amp; Credentials) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="WhatsApp / Phone"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden font-medium text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Player Rosters (Dynamic according to Format) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        2. {isSolo ? 'Solo Competitor Credentials' : isDuo ? 'Duo Roster Details (2 Players)' : 'Squad Roster (4 Players + 1 Substitute)'}
                      </h3>
                      <span className="text-[10px] font-mono text-gray-400">
                        {isSolo ? '1 Player' : isDuo ? '2 Players' : '4 Starters + 1 Sub'}
                      </span>
                    </div>

                    {/* PLAYER 1 (Leader / Solo) */}
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                      <span className="text-xs font-bold uppercase text-gray-800 flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-gold-primary"></span>
                        <span>{isSolo ? 'Solo Competitor' : 'Player 1 (Team Captain / Leader)'}</span>
                        <span className="text-rose-500">*</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">In-Game Name (IGN)</label>
                          <input
                            type="text"
                            required
                            placeholder="Username"
                            value={p1Ign}
                            onChange={(e) => setP1Ign(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden bg-white text-gray-900 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">In-Game Character UID</label>
                          <input
                            type="text"
                            required
                            placeholder="Character UID"
                            value={p1Uid}
                            onChange={(e) => setP1Uid(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden bg-white text-gray-900 font-medium font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PLAYER 2 (For Duo & Squad) */}
                    {(isDuo || isSquad) && (
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                        <span className="text-xs font-bold uppercase text-gray-800 flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-blue-500"></span>
                          <span>Player 2 {isDuo ? '(Teammate)' : '(Starter)'}</span>
                          <span className="text-rose-500">*</span>
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">In-Game Name (IGN)</label>
                            <input
                              type="text"
                              required
                              placeholder="Username"
                              value={p2Ign}
                              onChange={(e) => setP2Ign(e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden bg-white text-gray-900 font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">In-Game Character UID</label>
                            <input
                              type="text"
                              required
                              placeholder="Character UID"
                              value={p2Uid}
                              onChange={(e) => setP2Uid(e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden bg-white text-gray-900 font-medium font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PLAYER 3 & PLAYER 4 (For Squad Only) */}
                    {isSquad && (
                      <>
                        {/* PLAYER 3 */}
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                          <span className="text-xs font-bold uppercase text-gray-800 flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-emerald-500"></span>
                            <span>Player 3 (Starter)</span>
                            <span className="text-rose-500">*</span>
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-600 mb-1">In-Game Name (IGN)</label>
                              <input
                                type="text"
                                required
                                placeholder="Username"
                                value={p3Ign}
                                onChange={(e) => setP3Ign(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden bg-white text-gray-900 font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-600 mb-1">In-Game Character UID</label>
                              <input
                                type="text"
                                required
                                placeholder="Character UID"
                                value={p3Uid}
                                onChange={(e) => setP3Uid(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden bg-white text-gray-900 font-medium font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* PLAYER 4 */}
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                          <span className="text-xs font-bold uppercase text-gray-800 flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-purple-500"></span>
                            <span>Player 4 (Starter)</span>
                            <span className="text-rose-500">*</span>
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-600 mb-1">In-Game Name (IGN)</label>
                              <input
                                type="text"
                                required
                                placeholder="Username"
                                value={p4Ign}
                                onChange={(e) => setP4Ign(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden bg-white text-gray-900 font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-600 mb-1">In-Game Character UID</label>
                              <input
                                type="text"
                                required
                                placeholder="Character UID"
                                value={p4Uid}
                                onChange={(e) => setP4Uid(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden bg-white text-gray-900 font-medium font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* PLAYER 5 (SUBSTITUTE - 4 USERS + 1 SUBSTITUTE) */}
                        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase text-amber-900 flex items-center gap-1.5">
                              <span className="size-2 rounded-full bg-amber-500"></span>
                              <span>Player 5 (Substitute / 5th Player)</span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                              Optional Substitute
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Substitute IGN</label>
                              <input
                                type="text"
                                placeholder="Substitute Username (Optional)"
                                value={p5Ign}
                                onChange={(e) => setP5Ign(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden bg-white text-gray-900 font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Substitute Character UID</label>
                              <input
                                type="text"
                                placeholder="Character UID (Optional)"
                                value={p5Uid}
                                onChange={(e) => setP5Uid(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-gold-primary focus:outline-hidden bg-white text-gray-900 font-medium font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Section 3: Fair-Play Agreement Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="mt-0.5 size-4 rounded text-black focus:ring-gold-primary cursor-pointer"
                      />
                      <span className="text-xs text-gray-600 leading-relaxed">
                        I confirm that all player names and character IDs are authentic and belong to our clan. I agree to the tournament fair-play regulations, no emulator usage, and anti-cheat policies.
                      </span>
                    </label>
                  </div>

                  {/* Submit CTA Button */}
                  <div className="pt-2">
                    <ButtonLoader
                      type="submit"
                      loading={isSubmitting}
                      loadingText="Confirming Match Registration..."
                      className="w-full !py-4 !rounded-2xl !bg-black hover:!bg-gold-primary hover:!text-black !text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg transition-all"
                    >
                      <span>Confirm {isSolo ? 'Solo' : isDuo ? 'Duo' : 'Squad (4 + 1 Sub)'} Registration</span>
                      <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                    </ButtonLoader>
                  </div>

                </form>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
