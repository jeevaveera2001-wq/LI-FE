import React, { useState } from 'react';

export default function UserDashboard({ currentUser, onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('my-tournaments');
  const [joinedTournaments, setJoinedTournaments] = useState(() => {
    const saved = localStorage.getItem('lt_user_joined_tourneys');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'jt1',
        title: 'BGMI Pro Invitational 2026',
        game: 'Battlegrounds Mobile India',
        matchTime: 'Tomorrow at 06:00 PM IST',
        roomId: 'Room ID unlocks 15m before match',
        slot: 'Slot #14 (Squad Alpha)',
        status: 'CONFIRMED'
      },
      {
        id: 'jt2',
        title: 'Free Fire MAX Grand Finals',
        game: 'Free Fire MAX',
        matchTime: 'Dec 02, 2026 at 07:30 PM IST',
        roomId: 'Pending Schedule',
        slot: 'Slot #08',
        status: 'UPCOMING'
      }
    ];
  });

  const availableTournaments = [
    {
      id: 'at1',
      title: 'Valorant India Championship 2026',
      game: 'Valorant 5v5',
      prize: '₹4,00,000',
      date: 'Nov 22, 2026',
      slotsLeft: '4 slots left'
    },
    {
      id: 'at2',
      title: 'Call of Duty: Mobile Masters',
      game: 'COD Mobile Battle Royale',
      prize: '₹2,50,000',
      date: 'Dec 15, 2026',
      slotsLeft: '6 slots left'
    }
  ];

  const handleQuickJoin = (tournament) => {
    if (joinedTournaments.find(t => t.id === tournament.id)) return;
    const newEntry = {
      id: tournament.id,
      title: tournament.title,
      game: tournament.game,
      matchTime: `${tournament.date} at 07:00 PM IST`,
      roomId: 'Credentials will be emailed',
      slot: 'Slot Assigned',
      status: 'CONFIRMED'
    };
    const updated = [newEntry, ...joinedTournaments];
    setJoinedTournaments(updated);
    localStorage.setItem('lt_user_joined_tourneys', JSON.stringify(updated));
    setActiveTab('my-tournaments');
  };

  const displayName = currentUser?.name || currentUser?.username || 'Competitor';
  const displayEmail = currentUser?.email || 'user@livetournaments.in';
  const displayMobile = currentUser?.mobile || 'Verified Contact';

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold-primary selection:text-black">
      {/* Top User Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>
            <img src="/assets/lt_wordmark_custom.png" alt="LiveTournaments Logo" className="h-7 w-auto object-contain" />
          </div>
          <span className="h-4 w-[1px] bg-white/20 hidden sm:block"></span>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
            <span>👤</span>
            <span>PLAYER HUB & DASHBOARD</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-gold-light">{displayName}</span>
            <span className="text-[10px] text-white/50">{displayEmail}</span>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>🏠</span>
            <span className="hidden sm:inline">Home Arena</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/50 text-red-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main User Container */}
      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Welcome Card & Stats */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-white/15 p-6 md:p-8 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-gold-primary/20 text-gold-light border border-gold-primary/40 text-[10px] font-black uppercase">
                  Verified Competitor
                </span>
                <span className="text-xs text-white/50">&bull; Role: User</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-1">
                Welcome, {displayName}
              </h1>
              <p className="text-xs text-white/60 mt-1">
                Manage your championship entries, track match schedules, and prepare your squad.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('browse')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_15px_rgba(168,137,78,0.4)] transition-all cursor-pointer self-start sm:self-auto"
            >
              <span>+ Join New Tournament</span>
            </button>
          </div>

          {/* Quick Player Stat Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">Tournaments Joined</div>
              <div className="text-xl md:text-2xl font-black text-white mt-1">{joinedTournaments.length}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">Matches Played</div>
              <div className="text-xl md:text-2xl font-black text-gold-light mt-1">14</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">Win Ratio</div>
              <div className="text-xl md:text-2xl font-black text-green-400 mt-1">71.4%</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">Wallet Rewards</div>
              <div className="text-xl md:text-2xl font-black text-gold-light mt-1">₹4,500</div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
          {[
            { id: 'my-tournaments', label: `🎮 My Tournaments (${joinedTournaments.length})` },
            { id: 'browse', label: '⚔️ Browse & Enter Events' },
            { id: 'squad', label: '🛡️ My Team / Squad' },
            { id: 'profile', label: '⚙️ Account & Profile' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gold-primary text-black font-black shadow-[0_2px_10px_rgba(168,137,78,0.5)]'
                  : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: MY TOURNAMENTS */}
        {activeTab === 'my-tournaments' && (
          <div className="space-y-4">
            {joinedTournaments.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10">
                <p className="text-white/60 text-xs">You haven't entered any tournaments yet.</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="mt-3 px-4 py-2 rounded-xl bg-gold-primary text-black font-bold text-xs uppercase"
                >
                  Browse Active Tournaments
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {joinedTournaments.map(t => (
                  <div key={t.id} className="p-5 rounded-2xl bg-neutral-950/80 border border-gold-primary/30 space-y-3 shadow-lg">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-gold-primary uppercase tracking-wider">{t.game}</span>
                        <h3 className="text-sm font-black text-white mt-0.5">{t.title}</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 text-[9px] font-black uppercase">
                        {t.status}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                      <div className="flex justify-between text-white/70">
                        <span>Next Match:</span>
                        <strong className="text-white">{t.matchTime}</strong>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Squad Slot:</span>
                        <strong className="text-gold-light">{t.slot}</strong>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Room ID / Password:</span>
                        <strong className="text-yellow-400/90 text-[11px]">{t.roomId}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => alert(`Match briefing for ${t.title}: Check your email 15 minutes before the start time for the private custom room ID and password.`)}
                        className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase transition-colors cursor-pointer"
                      >
                        Match Briefing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BROWSE TOURNAMENTS */}
        {activeTab === 'browse' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableTournaments.map(at => (
                <div key={at.id} className="p-5 rounded-2xl bg-neutral-950/80 border border-white/15 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gold-primary uppercase tracking-wider">{at.game}</span>
                      <h3 className="text-sm font-black text-white mt-0.5">{at.title}</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-gold-primary/20 text-gold-light text-[9px] font-bold">
                      {at.slotsLeft}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-white/5">
                    <div>
                      <span className="text-[10px] text-white/60 block">Prize Pool</span>
                      <strong className="text-gold-light font-black text-sm">{at.prize}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-white/60 block">Date</span>
                      <strong className="text-white">{at.date}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickJoin(at)}
                    className="w-full py-2.5 rounded-xl bg-gradient-primary hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(168,137,78,0.4)] cursor-pointer"
                  >
                    Quick Register (Instant Entry) ⚡
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MY TEAM / SQUAD */}
        {activeTab === 'squad' && (
          <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Squad Roster: Team Dominators</h3>
                <p className="text-[11px] text-white/60">Registered for official championship brackets</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-gold-primary/20 text-gold-light border border-gold-primary/40 text-[10px] font-bold uppercase">
                Active Squad
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-gold-primary/40">
                <span className="text-[10px] text-gold-primary font-bold uppercase">Leader / IGL</span>
                <div className="font-bold text-white mt-1">{displayName} (You)</div>
                <div className="text-[10px] text-green-400 mt-0.5">● Ready</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/50 font-bold uppercase">Assaulter</span>
                <div className="font-bold text-white mt-1">Apex_Striker</div>
                <div className="text-[10px] text-green-400 mt-0.5">● Ready</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/50 font-bold uppercase">Sniper</span>
                <div className="font-bold text-white mt-1">Shadow_Viper</div>
                <div className="text-[10px] text-green-400 mt-0.5">● Ready</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/50 font-bold uppercase">Support</span>
                <div className="font-bold text-white mt-1">Ghost_Rider</div>
                <div className="text-[10px] text-green-400 mt-0.5">● Ready</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNT & PROFILE */}
        {activeTab === 'profile' && (
          <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-4 max-w-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Competitor Profile Details</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 flex justify-between items-center">
                <span className="text-white/60">Gamer Tag:</span>
                <strong className="text-white font-mono">{displayName}</strong>
              </div>
              <div className="p-3 rounded-xl bg-white/5 flex justify-between items-center">
                <span className="text-white/60">Email Address:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-white">{displayEmail}</span>
                  <span className="px-1.5 py-0.2 rounded bg-green-500/20 text-green-400 text-[9px] font-bold">VERIFIED</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 flex justify-between items-center">
                <span className="text-white/60">Mobile Number:</span>
                <strong className="text-white font-mono">{displayMobile}</strong>
              </div>
              <div className="p-3 rounded-xl bg-white/5 flex justify-between items-center">
                <span className="text-white/60">Assigned Role:</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase">
                  User / Normal Competitor
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate && onNavigate('home')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase transition-colors"
              >
                ← Return to Home Arena
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
