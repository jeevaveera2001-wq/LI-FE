import React, { useState, useEffect } from 'react';

export default function SuperAdminDashboard({ currentUser, onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [tournamentFilter, setTournamentFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Initial tournaments with editable state
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

  // Initial users with editable state
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
      id: `t_${Date.now()}`,
      title: newTitle,
      game: newGame,
      prize: newPrize.startsWith('₹') ? newPrize : `₹${newPrize}`,
      teams: `0 / ${newSlots}`,
      status: 'REGISTRATION OPEN',
      date: newDate || 'Dec 2026',
    };

    setTournaments([newTourney, ...tournaments]);
    setNewTitle('');
    setNewPrize('');
    setNewDate('');
    setShowCreateModal(false);
  };

  const handleDeleteTournament = (id) => {
    setTournaments(tournaments.filter(t => t.id !== id));
  };

  const toggleTournamentStatus = (id) => {
    setTournaments(tournaments.map(t => {
      if (t.id !== id) return t;
      const order = ['REGISTRATION OPEN', 'LIVE', 'COMPLETED', 'UPCOMING'];
      const nextIdx = (order.indexOf(t.status) + 1) % order.length;
      return { ...t, status: order[nextIdx] };
    }));
  };

  const filteredTournaments = tournaments.filter(t => {
    const matchQuery = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       t.game.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = tournamentFilter === 'all' || t.status === tournamentFilter;
    return matchQuery && matchFilter;
  });

  const filteredUsers = usersList.filter(u => {
    return u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           u.role.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-gold-primary selection:text-white">
      {/* Top Executive Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className="px-3.5 py-1.5 rounded-xl bg-black flex items-center shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onNavigate && onNavigate('home')}
            title="LiveTournaments.in Home"
          >
            <img
              src="/assets/lt_wordmark_custom.png"
              alt="LiveTournaments Logo"
              style={{ height: '24px', maxHeight: '24px', width: 'auto' }}
              className="object-contain"
            />
          </div>
          <span className="h-5 w-[1px] bg-slate-300 hidden sm:block"></span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-black uppercase tracking-wider shadow-xs">
            <span>👑</span>
            <span>SUPER ADMIN PORTAL</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-900">{currentUser?.email || 'superadmin@lt.in'}</span>
            <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Role: Super Admin (Direct Control)</span>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>🌐</span>
            <span className="hidden sm:inline">View Site</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Welcome & Quick Stats */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 md:p-8 shadow-sm bg-gradient-to-br from-amber-50/40 via-white to-sky-50/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Championship Control Room</p>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 mt-1">
                Welcome, Super Admin
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                You have exclusive platform-wide authority. All user registrations and tournament ops are live.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer self-start md:self-auto"
            >
              <span>+ Create Tournament</span>
            </button>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Registered Users</div>
              <div className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{usersList.length}</div>
              <div className="text-[10px] text-emerald-700 mt-1 font-semibold">● 100% Live Verified in Atlas</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Tournaments</div>
              <div className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{tournaments.length}</div>
              <div className="text-[10px] text-amber-700 mt-1 font-semibold">● BGMI, Free Fire, Valorant</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Prize Pool</div>
              <div className="text-2xl md:text-3xl font-black text-amber-800 mt-1">₹18,00,000</div>
              <div className="text-[10px] text-emerald-700 mt-1 font-semibold">● Ready for Payouts</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Platform Authority</div>
              <div className="text-2xl md:text-3xl font-black text-amber-900 mt-1">SUPER ADMIN</div>
              <div className="text-[10px] text-slate-600 mt-1 font-semibold">● superadmin@lt.in</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
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
                  ? 'bg-gradient-primary text-white font-black shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-gold-primary text-slate-900 text-xs shadow-xs outline-none transition-all placeholder-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                {['all', 'LIVE', 'UPCOMING', 'REGISTRATION OPEN', 'COMPLETED'].map(status => (
                  <button
                    key={status}
                    onClick={() => setTournamentFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                      tournamentFilter === status
                        ? 'bg-amber-100 border border-amber-400 text-amber-900 shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/90 uppercase text-[10px] font-black tracking-wider text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Tournament Title</th>
                    <th className="px-4 py-3.5">Game Title</th>
                    <th className="px-4 py-3.5">Prize Pool</th>
                    <th className="px-4 py-3.5">Slots Filled</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredTournaments.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                        <span>⚔️</span>
                        <span>{t.title}</span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{t.game}</td>
                      <td className="px-4 py-3.5 font-black text-amber-700">{t.prize}</td>
                      <td className="px-4 py-3.5 text-slate-600">{t.teams}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          t.status === 'LIVE' ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse' :
                          t.status === 'REGISTRATION OPEN' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          t.status === 'UPCOMING' ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => toggleTournamentStatus(t.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-[10px] font-bold uppercase transition-colors cursor-pointer"
                        >
                          Toggle Status
                        </button>
                        <button
                          onClick={() => handleDeleteTournament(t.id)}
                          className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[10px] font-bold transition-colors cursor-pointer"
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
            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Two-Role User Hierarchy Active
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  1. <strong className="text-amber-800">superadmin</strong> (Direct dashboard authority) &bull; 
                  2. <strong className="text-slate-900">user</strong> (Normal competitor with menu & user dashboard)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-black uppercase">
                  1 Super Admin
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase">
                  {usersList.length - 1} Normal Users
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/90 uppercase text-[10px] font-black tracking-wider text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Name / Gamer Tag</th>
                    <th className="px-4 py-3.5">Email Address</th>
                    <th className="px-4 py-3.5">Mobile Number</th>
                    <th className="px-4 py-3.5">Assigned Role</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                        {u.role === 'superadmin' ? '👑' : '👤'}
                        <span>{u.name}</span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 font-mono text-[11px]">{u.email}</td>
                      <td className="px-4 py-3.5 text-slate-600">{u.mobile}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          u.role === 'superadmin'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block size-2 rounded-full bg-emerald-500 mr-1.5" />
                        <span className="text-[10px] font-bold text-emerald-700">{u.status}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-slate-500 text-[11px]">{u.joined}</td>
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
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span>⚡</span>
                <span>Platform Controls</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <div className="font-bold text-slate-900">Public Player Registration</div>
                    <div className="text-[10px] text-slate-500">Allow new users to register via email OTP</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">ENABLED</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <div className="font-bold text-slate-900">Email Verification via Port 465</div>
                    <div className="text-[10px] text-slate-500">Vercel serverless with Gmail Implicit SSL/TLS</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">ACTIVE (100% OK)</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <div className="font-bold text-slate-900">MongoDB Atlas Multi-Region Sync</div>
                    <div className="text-[10px] text-slate-500">Database cluster0.x5vmife.mongodb.net</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">CONNECTED</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span>🔐</span>
                <span>Super Admin Credentials</span>
              </h3>
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Username / Email:</span>
                  <span className="font-mono font-bold text-amber-900">superadmin@lt.in</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Password Status:</span>
                  <span className="font-mono font-bold text-emerald-700">Configured (SuperAdmin@21)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Assigned Privilege:</span>
                  <span className="font-bold text-amber-900 uppercase">Full Superadmin Dashboard</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CREATE TOURNAMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Create New Tournament</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="size-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTournament} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Tournament Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. BGMI Winter Clash 2026"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-gold-primary text-slate-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Game</label>
                <select
                  value={newGame}
                  onChange={(e) => setNewGame(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-gold-primary text-slate-900 outline-none"
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
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Prize Pool</label>
                  <input
                    type="text"
                    value={newPrize}
                    onChange={(e) => setNewPrize(e.target.value)}
                    placeholder="e.g. ₹2,00,000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-gold-primary text-slate-900 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Team Slots</label>
                  <input
                    type="number"
                    value={newSlots}
                    onChange={(e) => setNewSlots(e.target.value)}
                    placeholder="32"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-gold-primary text-slate-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Event Dates</label>
                <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder="e.g. Dec 10 - Dec 14, 2026"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-gold-primary text-slate-900 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-primary hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
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
