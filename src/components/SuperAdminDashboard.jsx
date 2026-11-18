import React, { useState, useEffect } from 'react';

export default function SuperAdminDashboard({ currentUser, onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [tournamentFilter, setTournamentFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock initial tournaments with editable state
  const [tournaments, setTournaments] = useState(() => {
    const saved = localStorage.getItem('lt_admin_tournaments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 't1', title: 'BGMI Pro Invitational 2026', game: 'Battlegrounds Mobile India', prize: '₹5,00,000', teams: '64 / 64', status: 'LIVE', date: 'Nov 20 - Nov 25, 2026' },
      { id: 't2', title: 'Free Fire MAX Grand Finals', game: 'Free Fire MAX', prize: '₹3,50,000', teams: '48 / 48', status: 'UPCOMING', date: 'Dec 02 - Dec 06, 2026' },
      { id: 't3', title: 'Valorant India Championship', game: 'Valorant', prize: '₹4,00,000', teams: '32 / 32', status: 'LIVE', date: 'Nov 18 - Nov 22, 2026' },
      { id: 't4', title: 'Call of Duty: Mobile Masters', game: 'COD Mobile', prize: '₹2,50,000', teams: '28 / 32', status: 'REGISTRATION OPEN', date: 'Dec 15 - Dec 18, 2026' },
      { id: 't5', title: 'Apex Legends Global Series Cup', game: 'Apex Legends', prize: '₹3,00,000', teams: '20 / 20', status: 'COMPLETED', date: 'Nov 01 - Nov 05, 2026' },
    ];
  });

  // Mock initial users with editable state
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('lt_admin_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'u1', name: 'Super Admin', email: 'superadmin@lt.in', mobile: '+91 98765 43210', role: 'superadmin', joined: 'Nov 18, 2026', status: 'ACTIVE' },
      { id: 'u2', name: 'Phoenix_Ace', email: 'champion@gmail.com', mobile: '+91 98111 22334', role: 'user', joined: 'Nov 18, 2026', status: 'ACTIVE' },
      { id: 'u3', name: 'Vortex_Sniper', email: 'vortex@esports.in', mobile: '+91 98222 33445', role: 'user', joined: 'Nov 17, 2026', status: 'ACTIVE' },
      { id: 'u4', name: 'Shadow_Ninja', email: 'shadow@gmail.com', mobile: '+91 98333 44556', role: 'user', joined: 'Nov 16, 2026', status: 'ACTIVE' },
      { id: 'u5', name: 'Titan_Ruler', email: 'titan@livetournaments.in', mobile: '+91 98444 55667', role: 'user', joined: 'Nov 15, 2026', status: 'ACTIVE' },
    ];
  });

  // New Tournament Form State
  const [newTitle, setNewTitle] = useState('');
  const [newGame, setNewGame] = useState('Battlegrounds Mobile India');
  const [newPrize, setNewPrize] = useState('');
  const [newSlots, setNewSlots] = useState('32');
  const [newDate, setNewDate] = useState('');

  // Persist tournaments & users
  useEffect(() => {
    localStorage.setItem('lt_admin_tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('lt_admin_users', JSON.stringify(usersList));
  }, [usersList]);

  const handleCreateTournament = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrize) return;

    const newTourney = {
      id: 't_' + Date.now(),
      title: newTitle.trim(),
      game: newGame,
      prize: newPrize.startsWith('₹') || newPrize.startsWith('$') ? newPrize : '₹' + newPrize,
      teams: `0 / ${newSlots}`,
      status: 'REGISTRATION OPEN',
      date: newDate || 'Upcoming in Dec 2026'
    };

    setTournaments([newTourney, ...tournaments]);
    setNewTitle('');
    setNewPrize('');
    setNewDate('');
    setShowCreateModal(false);
  };

  const handleDeleteTournament = (id) => {
    if (window.confirm('Are you sure you want to remove this tournament?')) {
      setTournaments(tournaments.filter(t => t.id !== id));
    }
  };

  const toggleTournamentStatus = (id) => {
    setTournaments(tournaments.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'LIVE' ? 'COMPLETED' : t.status === 'UPCOMING' ? 'LIVE' : 'UPCOMING';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.game.toLowerCase().includes(searchQuery.toLowerCase());
    if (tournamentFilter === 'all') return matchesSearch;
    return matchesSearch && t.status === tournamentFilter;
  });

  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold-primary selection:text-black">
      {/* Top Super Admin Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-xl border-b border-gold-primary/30 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>
            <img src="/assets/lt_wordmark_custom.png" alt="LiveTournaments Logo" className="h-7 w-auto object-contain" />
          </div>
          <span className="h-4 w-[1px] bg-white/20 hidden sm:block"></span>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-primary/20 border border-gold-primary/60 text-gold-light text-[11px] font-black uppercase tracking-widest">
            <span>👑</span>
            <span>SUPER ADMIN PORTAL</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-white">{currentUser?.email || 'superadmin@lt.in'}</span>
            <span className="text-[10px] text-gold-light font-semibold uppercase tracking-wider">Role: Super Admin (Direct Control)</span>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>🌐</span>
            <span className="hidden sm:inline">View Site</span>
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

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Welcome & Quick Stats */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-gold-primary/40 p-6 md:p-8 shadow-[0_0_40px_rgba(168,137,78,0.15)]">
          <div className="absolute top-0 right-0 -z-0 translate-x-12 -translate-y-12 size-72 rounded-full bg-gold-primary/10 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-primary">Championship Control Room</p>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-1">
                Welcome, Super Admin
              </h1>
              <p className="text-xs text-white/60 mt-1">
                You have exclusive platform-wide authority. All user registrations and tournament ops are live.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_15px_rgba(168,137,78,0.4)] transition-all cursor-pointer self-start md:self-auto"
            >
              <span>+ Create Tournament</span>
            </button>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">Total Registered Users</div>
              <div className="text-2xl md:text-3xl font-black text-gold-light mt-1">{usersList.length}</div>
              <div className="text-[10px] text-green-400 mt-1 font-semibold">● 100% Live Verified in Atlas</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">Active Tournaments</div>
              <div className="text-2xl md:text-3xl font-black text-white mt-1">{tournaments.length}</div>
              <div className="text-[10px] text-gold-primary mt-1 font-semibold">● BGMI, Free Fire, Valorant</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">Total Prize Pool</div>
              <div className="text-2xl md:text-3xl font-black text-gold-light mt-1">₹18,00,000</div>
              <div className="text-[10px] text-green-400 mt-1 font-semibold">● Ready for Payouts</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">Platform Authority</div>
              <div className="text-2xl md:text-3xl font-black text-gold-light mt-1">SUPER ADMIN</div>
              <div className="text-[10px] text-gold-primary mt-1 font-semibold">● superadmin@lt.in</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
          {[
            { id: 'overview', label: '🏆 Tournaments Hub' },
            { id: 'users', label: '👥 User Accounts (2 Roles)' },
            { id: 'system', label: '⚙️ Platform Settings & Mail Ops' },
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

        {/* TAB 1: TOURNAMENTS HUB */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tournaments by game or title..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary text-white text-xs outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                {['all', 'LIVE', 'UPCOMING', 'REGISTRATION OPEN', 'COMPLETED'].map(status => (
                  <button
                    key={status}
                    onClick={() => setTournamentFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      tournamentFilter === status
                        ? 'bg-gold-primary/20 border border-gold-primary text-gold-light'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-neutral-950/70">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 uppercase text-[10px] font-black tracking-wider text-white/60 border-b border-white/10">
                  <tr>
                    <th className="px-5 py-3.5">Tournament Title</th>
                    <th className="px-4 py-3.5">Game Title</th>
                    <th className="px-4 py-3.5">Prize Pool</th>
                    <th className="px-4 py-3.5">Slots Filled</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/90">
                  {filteredTournaments.map(t => (
                    <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-bold text-white flex items-center gap-2">
                        <span>⚔️</span>
                        <span>{t.title}</span>
                      </td>
                      <td className="px-4 py-3.5 text-white/70">{t.game}</td>
                      <td className="px-4 py-3.5 font-black text-gold-light">{t.prize}</td>
                      <td className="px-4 py-3.5 text-white/70">{t.teams}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          t.status === 'LIVE' ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' :
                          t.status === 'REGISTRATION OPEN' ? 'bg-green-500/20 text-green-400 border border-green-500/40' :
                          t.status === 'UPCOMING' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' :
                          'bg-white/10 text-white/50'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => toggleTournamentStatus(t.id)}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold uppercase transition-colors cursor-pointer"
                        >
                          Toggle Status
                        </button>
                        <button
                          onClick={() => handleDeleteTournament(t.id)}
                          className="px-2 py-1 rounded-lg bg-red-950/50 hover:bg-red-900/80 text-red-300 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: USER ACCOUNTS (2 ROLES ONLY) */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-gold-primary/30 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold-light">
                  Two-Role User Hierarchy Active
                </h3>
                <p className="text-[11px] text-white/70 mt-0.5">
                  1. <strong className="text-gold-light">superadmin</strong> (Direct dashboard authority) &bull; 
                  2. <strong className="text-white">user</strong> (Normal competitor with menu & user dashboard)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-gold-primary/20 border border-gold-primary/50 text-gold-light text-[10px] font-bold uppercase">
                  1 Super Admin
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/80 text-[10px] font-bold uppercase">
                  {usersList.length - 1} Normal Users
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-neutral-950/70">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 uppercase text-[10px] font-black tracking-wider text-white/60 border-b border-white/10">
                  <tr>
                    <th className="px-5 py-3.5">Name / Gamer Tag</th>
                    <th className="px-4 py-3.5">Email Address</th>
                    <th className="px-4 py-3.5">Mobile Number</th>
                    <th className="px-4 py-3.5">Assigned Role</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/90">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-bold text-white flex items-center gap-2">
                        {u.role === 'superadmin' ? '👑' : '👤'}
                        <span>{u.name}</span>
                      </td>
                      <td className="px-4 py-3.5 text-white/80">{u.email}</td>
                      <td className="px-4 py-3.5 text-white/70">{u.mobile}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          u.role === 'superadmin'
                            ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/60'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block size-2 rounded-full bg-green-500 mr-1.5" />
                        <span className="text-[10px] font-semibold text-green-400">{u.status}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-white/50 text-[11px]">{u.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEM SETTINGS & EMAIL OPS */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gold-light flex items-center gap-2">
                <span>⚡</span>
                <span>Platform Controls</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div>
                    <div className="font-bold text-white">Public Player Registration</div>
                    <div className="text-[10px] text-white/60">Allow new users to register via email OTP</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase">ENABLED</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div>
                    <div className="font-bold text-white">Email Verification via Port 465</div>
                    <div className="text-[10px] text-white/60">Vercel serverless with Gmail Implicit SSL/TLS</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase">ACTIVE (100% OK)</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div>
                    <div className="font-bold text-white">MongoDB Atlas Multi-Region Sync</div>
                    <div className="text-[10px] text-white/60">Database cluster0.x5vmife.mongodb.net</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase">CONNECTED</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gold-light flex items-center gap-2">
                <span>🔐</span>
                <span>Super Admin Credentials</span>
              </h3>
              <div className="p-4 rounded-xl bg-gold-primary/10 border border-gold-primary/30 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/60">Username / Email:</span>
                  <span className="font-mono font-bold text-gold-light">superadmin@lt.in</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Password Status:</span>
                  <span className="font-mono font-bold text-green-400">Configured (SuperAdmin@21)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Assigned Privilege:</span>
                  <span className="font-bold text-gold-light uppercase">Full Superadmin Dashboard</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CREATE TOURNAMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-neutral-950 border border-gold-primary/60 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">Create New Tournament</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="size-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTournament} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1">Tournament Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. BGMI Winter Clash 2026"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1">Game</label>
                <select
                  value={newGame}
                  onChange={(e) => setNewGame(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/15 focus:border-gold-primary text-white outline-none"
                >
                  <option value="Battlegrounds Mobile India">Battlegrounds Mobile India (BGMI)</option>
                  <option value="Free Fire MAX">Free Fire MAX</option>
                  <option value="Valorant">Valorant</option>
                  <option value="Call of Duty: Mobile">Call of Duty: Mobile</option>
                  <option value="Apex Legends">Apex Legends</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1">Prize Pool</label>
                  <input
                    type="text"
                    value={newPrize}
                    onChange={(e) => setNewPrize(e.target.value)}
                    placeholder="e.g. ₹2,00,000"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1">Team Slots</label>
                  <input
                    type="number"
                    value={newSlots}
                    onChange={(e) => setNewSlots(e.target.value)}
                    placeholder="32"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1">Event Dates</label>
                <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder="e.g. Dec 10 - Dec 14, 2026"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-primary hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_15px_rgba(168,137,78,0.4)] transition-all cursor-pointer"
              >
                Launch Tournament 🚀
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
