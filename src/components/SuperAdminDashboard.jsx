import React, { useState, useEffect } from 'react';

export default function SuperAdminDashboard({ currentUser, onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [tournamentFilter, setTournamentFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Editable tournaments
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

  // Editable users (Strict 2-role hierarchy)
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

  // Persist changes
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
    <section className="relative block-default-horizontal-spacing block-default-vertical-spacing w-full">
      <div className="block-default-content-width mx-auto flex flex-col gap-6 md:gap-8">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center gap-1.5 text-dark-default hover:text-gold-primary primary-bold-s12-lh120 uppercase transition-colors cursor-pointer"
            >
              <span>← Home Arena</span>
            </button>
            <span className="text-[#858585]">&bull;</span>
            <span className="primary-bold-s12-lh120 uppercase tracking-wider text-gold-primary">
              Super Admin Control
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-white-dirty border border-[#EBEBEB] text-dark-default primary-bold-s10-lh130 uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
            >
              🌐 View Site
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-xl bg-red-accent/10 hover:bg-red-accent/20 border border-red-accent/20 text-red-accent primary-bold-s10-lh130 uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>

        {/* Section Title Header (Exact EWC Home Page Pattern) */}
        <div className="rounded-2xl lg:rounded-3xl bg-white p-6 md:p-8 shadow-md border border-[#EBEBEB]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="text-dark-default section-title flex flex-col gap-1 text-left">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/30 text-gold-primary primary-bold-s10-lh130 uppercase tracking-wider">
                  👑 Super Admin Portal
                </span>
                <span className="primary-regular-s12-lh130 text-[#858585]">
                  Role: Super Admin (Direct Control)
                </span>
              </div>
              <h1 className="primary-bold-s26-lh110 md:primary-bold-s32-lh100 lg:primary-bold-s38-lh100 xl:primary-bold-s42-lh90 uppercase mt-2">
                LiveTournaments Control Center
              </h1>
              <p className="primary-regular-s14-lh120 md:primary-regular-s18-lh120 text-[#858585]">
                Exclusive platform-wide management for esports tournaments, player rosters, and live operations &bull; <strong className="text-dark-default">{currentUser?.email || 'superadmin@lt.in'}</strong>
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="self-start lg:self-center px-6 py-3.5 rounded-xl bg-gradient-primary not-disabled:bg-gradient-primary-button text-white primary-bold-s12-lh120 uppercase tracking-wider shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              + Create Tournament
            </button>
          </div>

          {/* Quick Stat Cards Grid (Same as Home Page Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#F0F0F0]">
            <div className="p-4 rounded-2xl bg-white-dirty border border-[#EBEBEB]">
              <div className="primary-bold-s10-lh130 uppercase tracking-wider text-[#858585]">Total Registered Users</div>
              <div className="primary-bold-s28-lh100 md:primary-bold-s32-lh100 text-dark-default mt-1">{usersList.length}</div>
              <div className="primary-regular-s10-lh130 text-green-accent mt-1 font-bold">● 100% Live in Atlas</div>
            </div>

            <div className="p-4 rounded-2xl bg-white-dirty border border-[#EBEBEB]">
              <div className="primary-bold-s10-lh130 uppercase tracking-wider text-[#858585]">Active Tournaments</div>
              <div className="primary-bold-s28-lh100 md:primary-bold-s32-lh100 text-dark-default mt-1">{tournaments.length}</div>
              <div className="primary-regular-s10-lh130 text-gold-primary mt-1 font-bold">● BGMI, Free Fire, Valorant</div>
            </div>

            <div className="p-4 rounded-2xl bg-white-dirty border border-[#EBEBEB]">
              <div className="primary-bold-s10-lh130 uppercase tracking-wider text-[#858585]">Total Prize Pool</div>
              <div className="primary-bold-s28-lh100 md:primary-bold-s32-lh100 text-gold-primary mt-1">₹18,00,000</div>
              <div className="primary-regular-s10-lh130 text-green-accent mt-1 font-bold">● Ready for Payouts</div>
            </div>

            <div className="p-4 rounded-2xl bg-white-dirty border border-[#EBEBEB]">
              <div className="primary-bold-s10-lh130 uppercase tracking-wider text-[#858585]">Platform Authority</div>
              <div className="primary-bold-s20-lh120 md:primary-bold-s24-lh120 text-dark-default uppercase mt-2">SUPER ADMIN</div>
              <div className="primary-regular-s10-lh130 text-gold-primary mt-1">superadmin@lt.in</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher (Matching Home Page Tabs) */}
        <div className="flex items-center gap-2 border-b border-[#EBEBEB] pb-3 overflow-x-auto">
          {[
            { id: 'overview', label: '🏆 Tournaments Hub' },
            { id: 'users', label: '👥 User Accounts (2 Roles)' },
            { id: 'system', label: '⚙️ Platform Settings & Mail Ops' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl primary-bold-s12-lh120 uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-primary not-disabled:bg-gradient-primary-button text-white shadow-sm'
                  : 'bg-white border border-[#EBEBEB] text-[#858585] hover:text-dark-default hover:bg-white-dirty'
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
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#EBEBEB] focus:border-gold-primary text-dark-default primary-regular-s14-lh120 shadow-xs outline-none transition-all placeholder-[#858585]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                {['all', 'LIVE', 'UPCOMING', 'REGISTRATION OPEN', 'COMPLETED'].map(status => (
                  <button
                    key={status}
                    onClick={() => setTournamentFilter(status)}
                    className={`px-3 py-1.5 rounded-lg primary-bold-s10-lh130 uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                      tournamentFilter === status
                        ? 'bg-gold-primary/10 border border-gold-primary text-gold-primary shadow-xs'
                        : 'bg-white border border-[#EBEBEB] text-[#858585] hover:bg-white-dirty'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl lg:rounded-3xl border border-[#EBEBEB] bg-white shadow-md">
              <table className="w-full text-left">
                <thead className="bg-white-dirty uppercase primary-bold-s10-lh130 tracking-wider text-[#858585] border-b border-[#EBEBEB]">
                  <tr>
                    <th className="px-5 py-4">Tournament Title</th>
                    <th className="px-4 py-4">Game Title</th>
                    <th className="px-4 py-4">Prize Pool</th>
                    <th className="px-4 py-4">Slots Filled</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0] text-dark-default">
                  {filteredTournaments.map(t => (
                    <tr key={t.id} className="hover:bg-white-dirty/60 transition-colors">
                      <td className="px-5 py-4 primary-bold-s14-lh120 text-dark-default flex items-center gap-2">
                        <span>⚔️</span>
                        <span>{t.title}</span>
                      </td>
                      <td className="px-4 py-4 primary-regular-s12-lh130 text-[#858585]">{t.game}</td>
                      <td className="px-4 py-4 primary-bold-s14-lh120 text-gold-primary">{t.prize}</td>
                      <td className="px-4 py-4 primary-regular-s12-lh130 text-[#858585]">{t.teams}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full primary-bold-s10-lh130 uppercase tracking-wider ${
                          t.status === 'LIVE' ? 'bg-red-accent/10 text-red-accent border border-red-accent/30 animate-pulse' :
                          t.status === 'REGISTRATION OPEN' ? 'bg-green-accent/10 text-green-accent border border-green-accent/30' :
                          t.status === 'UPCOMING' ? 'bg-gold-primary/10 text-gold-primary border border-gold-primary/30' :
                          'bg-gray-easy text-[#858585] border border-gray-mild'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        <button
                          onClick={() => toggleTournamentStatus(t.id)}
                          className="px-3 py-1 rounded-lg bg-white-dirty hover:bg-gray-easy text-dark-default border border-[#EBEBEB] primary-bold-s10-lh130 uppercase transition-colors cursor-pointer"
                        >
                          Toggle Status
                        </button>
                        <button
                          onClick={() => handleDeleteTournament(t.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-accent/10 hover:bg-red-accent/20 text-red-accent border border-red-accent/20 primary-bold-s10-lh130 uppercase transition-colors cursor-pointer"
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
            <div className="p-5 rounded-2xl bg-white border border-gold-primary/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="primary-bold-s14-lh120 uppercase tracking-wider text-dark-default">
                  Two-Role User Hierarchy Active
                </h3>
                <p className="primary-regular-s12-lh130 text-[#858585] mt-0.5">
                  1. <strong className="text-gold-primary">superadmin</strong> (Direct dashboard authority) &bull; 
                  2. <strong className="text-dark-default">user</strong> (Normal competitor with menu & user dashboard)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/30 text-gold-primary primary-bold-s10-lh130 uppercase">
                  1 Super Admin
                </span>
                <span className="px-3 py-1 rounded-full bg-white-dirty border border-[#EBEBEB] text-[#858585] primary-bold-s10-lh130 uppercase">
                  {usersList.length - 1} Normal Users
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl lg:rounded-3xl border border-[#EBEBEB] bg-white shadow-md">
              <table className="w-full text-left">
                <thead className="bg-white-dirty uppercase primary-bold-s10-lh130 tracking-wider text-[#858585] border-b border-[#EBEBEB]">
                  <tr>
                    <th className="px-5 py-4">Name / Gamer Tag</th>
                    <th className="px-4 py-4">Email Address</th>
                    <th className="px-4 py-4">Mobile Number</th>
                    <th className="px-4 py-4">Assigned Role</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0] text-dark-default">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-white-dirty/60 transition-colors">
                      <td className="px-5 py-4 primary-bold-s14-lh120 text-dark-default flex items-center gap-2">
                        {u.role === 'superadmin' ? '👑' : '👤'}
                        <span>{u.name}</span>
                      </td>
                      <td className="px-4 py-4 primary-regular-s12-lh130 text-dark-default font-mono">{u.email}</td>
                      <td className="px-4 py-4 primary-regular-s12-lh130 text-[#858585]">{u.mobile}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full primary-bold-s10-lh130 uppercase tracking-wider ${
                          u.role === 'superadmin'
                            ? 'bg-gold-primary/15 text-gold-primary border border-gold-primary/40'
                            : 'bg-white-dirty text-dark-default border border-[#EBEBEB]'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-block size-2 rounded-full bg-green-accent mr-1.5" />
                        <span className="primary-bold-s10-lh130 text-green-accent">{u.status}</span>
                      </td>
                      <td className="px-5 py-4 text-right primary-regular-s10-lh130 text-[#858585]">{u.joined}</td>
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
            <div className="p-6 rounded-2xl lg:rounded-3xl bg-white border border-[#EBEBEB] shadow-md space-y-4">
              <h3 className="primary-bold-s14-lh120 uppercase tracking-wider text-dark-default flex items-center gap-2">
                <span>⚡</span>
                <span>Platform Controls</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white-dirty border border-[#EBEBEB]">
                  <div>
                    <div className="primary-bold-s12-lh120 text-dark-default">Public Player Registration</div>
                    <div className="primary-regular-s10-lh130 text-[#858585]">Allow new users to register via email OTP</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-green-accent/10 text-green-accent border border-green-accent/30 primary-bold-s10-lh130 uppercase">ENABLED</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white-dirty border border-[#EBEBEB]">
                  <div>
                    <div className="primary-bold-s12-lh120 text-dark-default">Email Verification via Port 465</div>
                    <div className="primary-regular-s10-lh130 text-[#858585]">Vercel serverless with Gmail Implicit SSL/TLS</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-green-accent/10 text-green-accent border border-green-accent/30 primary-bold-s10-lh130 uppercase">ACTIVE (100% OK)</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white-dirty border border-[#EBEBEB]">
                  <div>
                    <div className="primary-bold-s12-lh120 text-dark-default">MongoDB Atlas Multi-Region Sync</div>
                    <div className="primary-regular-s10-lh130 text-[#858585]">Database cluster0.x5vmife.mongodb.net</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-green-accent/10 text-green-accent border border-green-accent/30 primary-bold-s10-lh130 uppercase">CONNECTED</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl lg:rounded-3xl bg-white border border-[#EBEBEB] shadow-md space-y-4">
              <h3 className="primary-bold-s14-lh120 uppercase tracking-wider text-dark-default flex items-center gap-2">
                <span>🔐</span>
                <span>Super Admin Credentials</span>
              </h3>
              <div className="p-4 rounded-xl bg-gold-primary/10 border border-gold-primary/30 space-y-2.5">
                <div className="flex justify-between">
                  <span className="primary-regular-s12-lh130 text-[#858585]">Username / Email:</span>
                  <span className="primary-bold-s12-lh120 text-gold-primary font-mono">superadmin@lt.in</span>
                </div>
                <div className="flex justify-between">
                  <span className="primary-regular-s12-lh130 text-[#858585]">Password Status:</span>
                  <span className="primary-bold-s12-lh120 text-green-accent font-mono">Configured (SuperAdmin@21)</span>
                </div>
                <div className="flex justify-between">
                  <span className="primary-regular-s12-lh130 text-[#858585]">Assigned Privilege:</span>
                  <span className="primary-bold-s12-lh120 text-gold-primary uppercase">Full Superadmin Dashboard</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE TOURNAMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-default/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl lg:rounded-3xl bg-white border border-[#EBEBEB] p-6 shadow-2xl space-y-4 text-dark-default">
            <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-3">
              <h3 className="primary-bold-s16-lh120 uppercase tracking-wider text-dark-default">Create New Tournament</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="size-7 rounded-full bg-white-dirty flex items-center justify-center text-[#858585] hover:text-dark-default hover:bg-gray-easy cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTournament} className="space-y-3">
              <div>
                <label className="block primary-bold-s10-lh130 uppercase tracking-wider text-dark-default mb-1">Tournament Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. BGMI Winter Clash 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-white-dirty border border-[#EBEBEB] focus:border-gold-primary text-dark-default primary-regular-s14-lh120 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block primary-bold-s10-lh130 uppercase tracking-wider text-dark-default mb-1">Game</label>
                <select
                  value={newGame}
                  onChange={(e) => setNewGame(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white-dirty border border-[#EBEBEB] focus:border-gold-primary text-dark-default primary-regular-s14-lh120 outline-none"
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
                  <label className="block primary-bold-s10-lh130 uppercase tracking-wider text-dark-default mb-1">Prize Pool</label>
                  <input
                    type="text"
                    value={newPrize}
                    onChange={(e) => setNewPrize(e.target.value)}
                    placeholder="e.g. ₹2,00,000"
                    className="w-full px-4 py-2.5 rounded-xl bg-white-dirty border border-[#EBEBEB] focus:border-gold-primary text-dark-default primary-regular-s14-lh120 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block primary-bold-s10-lh130 uppercase tracking-wider text-dark-default mb-1">Team Slots</label>
                  <input
                    type="number"
                    value={newSlots}
                    onChange={(e) => setNewSlots(e.target.value)}
                    placeholder="32"
                    className="w-full px-4 py-2.5 rounded-xl bg-white-dirty border border-[#EBEBEB] focus:border-gold-primary text-dark-default primary-regular-s14-lh120 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block primary-bold-s10-lh130 uppercase tracking-wider text-dark-default mb-1">Event Dates</label>
                <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder="e.g. Dec 10 - Dec 14, 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-white-dirty border border-[#EBEBEB] focus:border-gold-primary text-dark-default primary-regular-s14-lh120 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-primary not-disabled:bg-gradient-primary-button hover:brightness-105 active:scale-95 text-white primary-bold-s12-lh120 uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Launch Tournament 🚀
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
