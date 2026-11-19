import React, { useState } from 'react';

const TOURNAMENTS_DATA = [
  {
    id: 'bgmi-showdown',
    title: 'BGMI SHOWDOWN TOURNAMENT',
    game: 'BATTLEGROUNDS MOBILE INDIA',
    category: 'LIVE',
    isFeatured: true,
    isLive: true,
    isUpcoming: false,
    badge: '🔴 LIVE NOW',
    badgeColor: 'bg-red-600 text-white animate-pulse',
    viewers: '14,820 Watching',
    prizePool: '₹ 1,50,000 INR',
    slots: '32/32 Teams',
    stage: 'Grand Finals • Match 4 of 6 (Erangel)',
    image: '/assets/tournament_bgmi_showdown_4k.jpg',
    description: 'The premier battle royale championship featuring tier-1 squads fighting across Erangel & Miramar for glory.'
  },
  {
    id: 'pubg-mobile-global',
    title: 'PUBG MOBILE GLOBAL CHAMPIONSHIP',
    game: 'PUBG MOBILE',
    category: 'FEATURED',
    isFeatured: true,
    isLive: false,
    isUpcoming: true,
    badge: '⭐ FEATURED PREMIER',
    badgeColor: 'bg-gold-primary text-black font-bold',
    viewers: 'Starts in 2 Days',
    prizePool: '₹ 5,00,000 INR',
    slots: '142/160 Slots Filled',
    stage: 'Regional Qualifiers • Clan Registration Open',
    image: '/assets/tournament_pubg_mobile_4k.jpg',
    description: 'The ultimate international clash bringing the finest verified rosters together to compete on the world stage.'
  },
  {
    id: 'bgmi-lan-warriors',
    title: 'BGMI LAN WARRIORS CHALLENGE',
    game: 'BATTLEGROUNDS MOBILE INDIA',
    category: 'LIVE',
    isFeatured: false,
    isLive: true,
    isUpcoming: false,
    badge: '🔴 LIVE NOW',
    badgeColor: 'bg-red-600 text-white animate-pulse',
    viewers: '8,940 Watching',
    prizePool: '₹ 75,000 INR',
    slots: '24/24 Teams',
    stage: 'Semi-Finals Stage • Miramar Drop',
    image: '/assets/tournament_bgmi_lan_warriors_4k.jpg',
    description: 'Top-tier Indian teams battle in an intense offline custom lobby with official broadcaster production.'
  },
  {
    id: 'pubg-ultimate-squad',
    title: 'PUBG ULTIMATE SQUAD SERIES',
    game: 'PUBG MOBILE',
    category: 'UPCOMING',
    isFeatured: true,
    isLive: false,
    isUpcoming: true,
    badge: '⏳ REGISTRATION CLOSING',
    badgeColor: 'bg-emerald-600 text-white',
    viewers: 'Starts Tomorrow 6:00 PM',
    prizePool: '₹ 30,000 INR',
    slots: '46/50 Teams Joined',
    stage: 'Squad Custom Lobby • Open Bracket',
    image: '/assets/tournament_pubg_ultimate_squad_4k.jpg',
    description: 'High octane daily competitive series featuring rapid rounds, custom room codes, and automated points tallying.'
  }
];

export default function FeaturedTournamentsSection({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, FEATURED, LIVE, UPCOMING

  const filteredTournaments = TOURNAMENTS_DATA.filter(t => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'FEATURED') return t.isFeatured;
    if (activeFilter === 'LIVE') return t.isLive;
    if (activeFilter === 'UPCOMING') return t.isUpcoming;
    return true;
  });

  const handleCardClick = (t) => {
    if (onNavigate) {
      onNavigate('register');
    }
  };

  return (
    <section
      id="tournaments-section"
      data-section="play"
      className="relative block-default-horizontal-spacing block-default-vertical-spacing scroll-mt-20"
    >
      {/* Anchor for direct #play link support */}
      <span id="play" className="absolute -top-24 block invisible pointer-events-none" />

      <div className="block-default-content-width mx-auto">
        <div className="relative flex flex-col gap-6 md:gap-8">
          
          {/* Header Title & Subtitle */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="text-dark-default section-title flex w-full flex-col gap-2 text-left">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-primary/20 text-black border border-gold-primary/30">
                  <span className="material-symbols-outlined text-[16px] text-gold-primary">sports_esports</span>
                  Play Arena
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Official Competitions
                </span>
              </div>
              <h2 className="primary-bold-s26-lh110 md:primary-bold-s32-lh100 lg:primary-bold-s38-lh100 xl:primary-bold-s42-lh90">
                Tournaments Arena &amp; Brackets
              </h2>
              <p className="primary-regular-s14-lh120 md:primary-regular-s18-lh120 lg:primary-regular-s20-lh120 text-[#858585]">
                Featured, Live Tournaments &amp; Upcoming Competitions — Compete &amp; Dominate
              </p>
            </div>

            {/* Quick Action Link */}
            <div className="hidden lg:flex items-center gap-3 text-black shrink-0">
              <div className="h-px w-[80px] bg-black/20"></div>
              <button
                onClick={() => onNavigate && onNavigate('register')}
                className="primary-bold-s12-lh120 whitespace-nowrap uppercase tracking-wider hover:text-gold-primary flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>REGISTER SQUAD</span>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-3 rtl:rotate-180" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M15.5 5H11l5 7-5 7h4.5l5-7z"></path>
                  <path d="M8.5 5H4l5 7-5 7h4.5l5-7z"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Interactive Filter Pills: ALL, FEATURED, LIVE, UPCOMING */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'ALL'
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>All Tournaments ({TOURNAMENTS_DATA.length})</span>
            </button>

            <button
              onClick={() => setActiveFilter('FEATURED')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'FEATURED'
                  ? 'bg-gold-primary text-black shadow-md font-extrabold'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>⭐</span>
              <span>Featured Tournaments</span>
            </button>

            <button
              onClick={() => setActiveFilter('LIVE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'LIVE'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span className="size-2 rounded-full bg-red-500 animate-ping inline-block"></span>
              <span>Live Tournaments (2 Active)</span>
            </button>

            <button
              onClick={() => setActiveFilter('UPCOMING')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'UPCOMING'
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>Upcoming Tournaments</span>
            </button>
          </div>

          {/* Tournament Cards Carousel / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {filteredTournaments.map((tourney) => (
              <div
                key={tourney.id}
                onClick={() => handleCardClick(tourney)}
                className="group flex flex-col rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-black/5 overflow-hidden cursor-pointer transform hover:-translate-y-1"
              >
                {/* Image Banner */}
                <div className="relative aspect-[1.74/1] w-full overflow-hidden bg-dark-default">
                  <img
                    alt={tourney.title}
                    loading="lazy"
                    width="462"
                    height="266"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={tourney.image}
                  />

                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow ${tourney.badgeColor}`}>
                      {tourney.badge}
                    </span>
                  </div>

                  {/* Viewers or Status Bar */}
                  <div className="absolute bottom-2.5 right-3 bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-mono text-white/90">
                    {tourney.viewers}
                  </div>
                </div>

                {/* Content Details */}
                <div className="flex flex-col justify-between flex-1 p-4 lg:p-5 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gold-primary">
                      {tourney.game}
                    </p>
                    <h3 className="primary-bold-s16-lh120 text-dark-default uppercase group-hover:text-gold-primary transition-colors line-clamp-1">
                      {tourney.title}
                    </h3>
                    <p className="primary-medium-s13-lh120 line-clamp-2 text-[#707070] text-xs">
                      {tourney.description}
                    </p>
                  </div>

                  {/* Prize & Status Footer */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block">Prize Pool</span>
                      <span className="text-sm font-extrabold text-black font-mono">{tourney.prizePool}</span>
                    </div>

                    <button
                      className="px-3.5 py-1.5 rounded-lg bg-black text-white group-hover:bg-gold-primary group-hover:text-black text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                    >
                      {tourney.isLive ? 'Watch Live' : 'Join Match'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Mobile Action Button */}
          <div className="flex lg:hidden justify-center pt-2">
            <button
              onClick={() => onNavigate && onNavigate('register')}
              className="w-full py-3 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Explore All Competitive Brackets</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}