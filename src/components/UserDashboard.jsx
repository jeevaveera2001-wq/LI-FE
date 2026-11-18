import React, { useState } from 'react';

export default function UserDashboard({ currentUser, onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('my-tournaments');
  const [selectedBriefing, setSelectedBriefing] = useState(null);
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
  const displayMobile = currentUser?.mobile || '+91 98765 43210';

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
              Player Hub & Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-white-dirty border border-[#EBEBEB] text-dark-default primary-bold-s10-lh130 uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
            >
              🏠 Home
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
                  👤 Verified Competitor
                </span>
                <span className="primary-regular-s12-lh130 text-[#858585]">
                  Role: User &bull; {displayEmail}
                </span>
              </div>
              <h1 className="primary-bold-s26-lh110 md:primary-bold-s32-lh100 lg:primary-bold-s38-lh100 xl:primary-bold-s42-lh90 uppercase mt-2">
                Welcome, {displayName}
              </h1>
              <p className="primary-regular-s14-lh120 md:primary-regular-s18-lh120 text-[#858585]">
                Manage your championship entries, track match schedules, and prepare your squad.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('browse')}
              className="self-start lg:self-center px-6 py-3.5 rounded-xl bg-gradient-primary not-disabled:bg-gradient-primary-button text-white primary-bold-s12-lh120 uppercase tracking-wider shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              + Join New Tournament
            </button>
          </div>

          {/* Quick Player Stat Cards (Same as Home Page Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#F0F0F0]">
            <div className="p-4 rounded-2xl bg-white-dirty border border-[#EBEBEB]">
              <div className="primary-bold-s10-lh130 uppercase tracking-wider text-[#858585]">Tournaments Joined</div>
              <div className="primary-bold-s28-lh100 md:primary-bold-s32-lh100 text-dark-default mt-1">{joinedTournaments.length}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white-dirty border border-[#EBEBEB]">
              <div className="primary-bold-s10-lh130 uppercase tracking-wider text-[#858585]">Matches Played</div>
              <div className="primary-bold-s28-lh100 md:primary-bold-s32-lh100 text-gold-primary mt-1">14</div>
            </div>

            <div className="p-4 rounded-2xl bg-white-dirty border border-[#EBEBEB]">
              <div className="primary-bold-s10-lh130 uppercase tracking-wider text-[#858585]">Win Ratio</div>
              <div className="primary-bold-s28-lh100 md:primary-bold-s32-lh100 text-green-accent mt-1">71.4%</div>
            </div>

            <div className="p-4 rounded-2xl bg-white-dirty border border-[#EBEBEB]">
              <div className="primary-bold-s10-lh130 uppercase tracking-wider text-[#858585]">Wallet Rewards</div>
              <div className="primary-bold-s28-lh100 md:primary-bold-s32-lh100 text-gold-primary mt-1">₹4,500</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher (Matching Home Page Tabs) */}
        <div className="flex items-center gap-2 border-b border-[#EBEBEB] pb-3 overflow-x-auto">
          {[
            { id: 'my-tournaments', label: `🎮 My Tournaments (${joinedTournaments.length})` },
            { id: 'browse', label: '⚔️ Browse & Enter Events' },
            { id: 'squad', label: '🛡️ My Team / Squad' },
            { id: 'profile', label: '⚙️ Account & Profile' },
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

        {/* TAB 1: MY TOURNAMENTS */}
        {activeTab === 'my-tournaments' && (
          <div className="space-y-4">
            {joinedTournaments.length === 0 ? (
              <div className="p-8 text-center rounded-2xl lg:rounded-3xl bg-white border border-[#EBEBEB] shadow-sm">
                <p className="primary-regular-s14-lh120 text-[#858585]">You haven't entered any tournaments yet.</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="mt-3 px-5 py-2.5 rounded-xl bg-gradient-primary not-disabled:bg-gradient-primary-button text-white primary-bold-s12-lh120 uppercase shadow-xs cursor-pointer"
                >
                  Browse Active Tournaments
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {joinedTournaments.map(t => (
                  <div key={t.id} className="p-6 rounded-2xl lg:rounded-3xl bg-white border border-[#EBEBEB] space-y-4 shadow-md hover:border-gold-primary/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="primary-bold-s10-lh130 text-gold-primary uppercase tracking-wider">{t.game}</span>
                        <h3 className="primary-bold-s16-lh120 text-dark-default uppercase mt-1">{t.title}</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-green-accent/10 text-green-accent border border-green-accent/30 primary-bold-s10-lh130 uppercase">
                        {t.status}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white-dirty border border-[#EBEBEB] space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="primary-regular-s12-lh130 text-[#858585]">Next Match:</span>
                        <strong className="primary-bold-s12-lh120 text-dark-default">{t.matchTime}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="primary-regular-s12-lh130 text-[#858585]">Squad Slot:</span>
                        <strong className="primary-bold-s12-lh120 text-gold-primary">{t.slot}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="primary-regular-s12-lh130 text-[#858585]">Room ID / Password:</span>
                        <strong className="primary-bold-s12-lh120 text-dark-default font-mono">{t.roomId}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setSelectedBriefing(t)}
                        className="flex-1 py-2.5 rounded-xl bg-white-dirty hover:bg-gray-easy text-dark-default border border-[#EBEBEB] primary-bold-s10-lh130 uppercase tracking-wider transition-colors cursor-pointer"
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
                <div key={at.id} className="p-6 rounded-2xl lg:rounded-3xl bg-white border border-[#EBEBEB] space-y-4 shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="primary-bold-s10-lh130 text-gold-primary uppercase tracking-wider">{at.game}</span>
                      <h3 className="primary-bold-s16-lh120 text-dark-default uppercase mt-1">{at.title}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/30 text-gold-primary primary-bold-s10-lh130 uppercase">
                      {at.slotsLeft}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white-dirty border border-[#EBEBEB]">
                    <div>
                      <span className="primary-regular-s10-lh130 text-[#858585] block">Prize Pool</span>
                      <strong className="primary-bold-s18-lh120 text-gold-primary">{at.prize}</strong>
                    </div>
                    <div className="text-right">
                      <span className="primary-regular-s10-lh130 text-[#858585] block">Date</span>
                      <strong className="primary-bold-s14-lh120 text-dark-default">{at.date}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickJoin(at)}
                    className="w-full py-3 rounded-xl bg-gradient-primary not-disabled:bg-gradient-primary-button hover:brightness-105 active:scale-95 text-white primary-bold-s12-lh120 uppercase tracking-wider transition-all shadow-md cursor-pointer"
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
          <div className="p-6 md:p-8 rounded-2xl lg:rounded-3xl bg-white border border-[#EBEBEB] shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-4">
              <div>
                <h3 className="primary-bold-s18-lh120 uppercase tracking-wider text-dark-default">Squad Roster: Team Dominators</h3>
                <p className="primary-regular-s12-lh130 text-[#858585]">Registered for official championship brackets</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/30 text-gold-primary primary-bold-s10-lh130 uppercase">
                Active Squad
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white-dirty border border-gold-primary/40 shadow-xs">
                <span className="primary-bold-s10-lh130 text-gold-primary uppercase">Leader / IGL</span>
                <div className="primary-bold-s14-lh120 text-dark-default mt-1">{displayName} (You)</div>
                <div className="primary-bold-s10-lh130 text-green-accent mt-0.5">● Ready</div>
              </div>
              <div className="p-4 rounded-2xl bg-white-dirty border border-[#EBEBEB]">
                <span className="primary-bold-s10-lh130 text-[#858585] uppercase">Assaulter</span>
                <div className="primary-bold-s14-lh120 text-dark-default mt-1">Apex_Striker</div>
                <div className="primary-bold-s10-lh130 text-green-accent mt-0.5">● Ready</div>
              </div>
              <div className="p-4 rounded-2xl bg-white-dirty border border-[#EBEBEB]">
                <span className="primary-bold-s10-lh130 text-[#858585] uppercase">Sniper</span>
                <div className="primary-bold-s14-lh120 text-dark-default mt-1">Shadow_Viper</div>
                <div className="primary-bold-s10-lh130 text-green-accent mt-0.5">● Ready</div>
              </div>
              <div className="p-4 rounded-2xl bg-white-dirty border border-[#EBEBEB]">
                <span className="primary-bold-s10-lh130 text-[#858585] uppercase">Support</span>
                <div className="primary-bold-s14-lh120 text-dark-default mt-1">Ghost_Rider</div>
                <div className="primary-bold-s10-lh130 text-green-accent mt-0.5">● Ready</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNT & PROFILE */}
        {activeTab === 'profile' && (
          <div className="p-6 md:p-8 rounded-2xl lg:rounded-3xl bg-white border border-[#EBEBEB] shadow-md space-y-6 max-w-xl">
            <h3 className="primary-bold-s18-lh120 uppercase tracking-wider text-dark-default">Competitor Profile Details</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white-dirty border border-[#EBEBEB] flex justify-between items-center">
                <span className="primary-regular-s12-lh130 text-[#858585]">Gamer Tag:</span>
                <strong className="primary-bold-s14-lh120 text-dark-default">{displayName}</strong>
              </div>
              <div className="p-4 rounded-xl bg-white-dirty border border-[#EBEBEB] flex justify-between items-center">
                <span className="primary-regular-s12-lh130 text-[#858585]">Email Address:</span>
                <div className="flex items-center gap-2">
                  <span className="primary-regular-s12-lh130 text-dark-default font-mono">{displayEmail}</span>
                  <span className="px-2 py-0.5 rounded bg-green-accent/10 text-green-accent primary-bold-s10-lh130">VERIFIED</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white-dirty border border-[#EBEBEB] flex justify-between items-center">
                <span className="primary-regular-s12-lh130 text-[#858585]">Mobile Number:</span>
                <strong className="primary-bold-s14-lh120 text-dark-default">{displayMobile}</strong>
              </div>
              <div className="p-4 rounded-xl bg-white-dirty border border-[#EBEBEB] flex justify-between items-center">
                <span className="primary-regular-s12-lh130 text-[#858585]">Assigned Role:</span>
                <span className="px-3 py-1 rounded-full bg-white-dirty border border-[#EBEBEB] text-dark-default primary-bold-s10-lh130 uppercase">
                  User / Normal Competitor
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate && onNavigate('home')}
                className="px-5 py-2.5 rounded-xl bg-white-dirty hover:bg-gray-easy border border-[#EBEBEB] text-dark-default primary-bold-s10-lh130 uppercase transition-colors cursor-pointer"
              >
                ← Return to Home Arena
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MATCH BRIEFING MODAL */}
      {selectedBriefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-default/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl lg:rounded-3xl bg-white border border-[#EBEBEB] p-6 shadow-2xl space-y-4 text-dark-default">
            <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <h3 className="primary-bold-s16-lh120 uppercase tracking-wider text-dark-default">
                  Match Briefing
                </h3>
              </div>
              <button
                onClick={() => setSelectedBriefing(null)}
                className="size-7 rounded-full bg-white-dirty flex items-center justify-center text-[#858585] hover:text-dark-default hover:bg-gray-easy cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-gold-primary/10 border border-gold-primary/30">
                <div className="primary-bold-s10-lh130 uppercase text-gold-primary tracking-wider">Tournament</div>
                <div className="primary-bold-s16-lh120 text-dark-default mt-0.5">{selectedBriefing.title}</div>
                <div className="primary-regular-s12-lh130 text-[#858585] mt-0.5">{selectedBriefing.game}</div>
              </div>

              <div className="p-4 rounded-xl bg-white-dirty border border-[#EBEBEB] space-y-2">
                <div className="flex justify-between">
                  <span className="primary-regular-s12-lh130 text-[#858585]">Scheduled Time:</span>
                  <strong className="primary-bold-s12-lh120 text-dark-default">{selectedBriefing.matchTime}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="primary-regular-s12-lh130 text-[#858585]">Squad Slot:</span>
                  <strong className="primary-bold-s12-lh120 text-gold-primary">{selectedBriefing.slot}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="primary-regular-s12-lh130 text-[#858585]">Room Status:</span>
                  <strong className="primary-bold-s12-lh120 text-green-accent">{selectedBriefing.roomId}</strong>
                </div>
              </div>

              <p className="primary-regular-s12-lh130 text-[#858585] leading-relaxed">
                ✉️ Custom private match credentials (Room ID & Password) are automatically emailed to <strong className="text-dark-default">{displayEmail}</strong> exactly 15 minutes before the match start time. Ensure you and your squad join the custom lobby on time.
              </p>
            </div>

            <button
              onClick={() => setSelectedBriefing(null)}
              className="w-full py-3 rounded-xl bg-gradient-primary not-disabled:bg-gradient-primary-button hover:brightness-105 active:scale-95 text-white primary-bold-s12-lh120 uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Got It ✓
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
