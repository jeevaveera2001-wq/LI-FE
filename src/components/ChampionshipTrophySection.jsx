import React, { useState } from 'react';

export default function ChampionshipTrophySection({ onNavigate }) {
  const [notified, setNotified] = useState(false);

  const handleNotifyMe = () => {
    setNotified(true);
    setTimeout(() => {
      alert('🏆 Clan Notified! You are on the VIP Priority Alert list for the LiveTournaments Club Championship 2026.');
    }, 100);
  };

  return (
    <section
      id="championship-section"
      data-section="programs"
      className="relative block-default-horizontal-spacing block-default-vertical-spacing scroll-mt-20"
    >
      {/* Anchor for direct #programs link support */}
      <span id="programs" className="absolute -top-24 block invisible pointer-events-none" />

      <div className="block-default-content-width mx-auto">
        <div className="relative flex flex-col gap-6 md:gap-8">
          
          {/* Header Title & Subtitle */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="text-dark-default section-title flex w-full flex-col gap-2 normal-case text-left">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-primary text-black shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">tv</span>
                  Official Programs
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                  <span className="size-2 rounded-full bg-red-600 animate-ping inline-block mr-1"></span>
                  Coming Soon
                </span>
              </div>

              <h2 className="primary-bold-s26-lh110 md:primary-bold-s32-lh100 lg:primary-bold-s38-lh100 xl:primary-bold-s42-lh90 text-dark-default">
                LT.IN Championship Trophy — Coming Soon
              </h2>
              
              <p className="primary-regular-s14-lh120 md:primary-regular-s18-lh120 lg:primary-regular-s20-lh120 text-[#6B6B6B] max-w-3xl">
                Our Championship It Will Be Soon. The premier national esports spectacle arrives soon on LiveTournaments.in, pitting the top 32 verified clans for the handcrafted 24K championship trophy.
              </p>
            </div>

            {/* Notify Clan Button */}
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={handleNotifyMe}
                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-md cursor-pointer ${
                  notified
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black text-white hover:bg-gold-primary hover:text-black'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {notified ? 'check_circle' : 'notifications_active'}
                </span>
                <span>{notified ? 'Priority Waitlist Joined' : 'Notify My Clan (Coming Soon)'}</span>
              </button>
            </div>
          </div>

          {/* Championship Visual Showcase Card */}
          <div className="flex w-full flex-col items-center gap-4 md:gap-8">
            <div className="w-full overflow-hidden rounded-2xl md:rounded-3xl xl:rounded-4xl shadow-2xl bg-dark-default relative group">
              <img
                src="/assets/lt_championship_trophy_card_4k.png"
                alt="LT.IN Championship Trophy - Coming Soon"
                className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-102"
              />

              {/* Overlay Ribbon */}
              <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-black/80 backdrop-blur-md border border-gold-primary/40 rounded-2xl p-4 md:p-6 text-right max-w-xs shadow-xl hidden sm:block">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gold-primary block">Grand Prize Pool</span>
                <span className="text-xl md:text-3xl font-extrabold text-white font-mono block">₹ 25,00,000</span>
                <p className="text-[11px] text-white/70 mt-1">32 Verified Clans &bull; LAN Stage &bull; Live Broadcast</p>
              </div>

              {/* Floating Status Bar Bottom */}
              <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black via-black/80 to-transparent p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="size-3 rounded-full bg-gold-primary animate-ping"></div>
                  <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-gold-primary">
                    LiveTournaments.in Championship Program &bull; Season 1 Launching Soon
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
                  <span>Open Qualifiers: 16 Slots</span>
                  <span>&bull;</span>
                  <span>Direct Invites: 16 Clans</span>
                </div>
              </div>
            </div>
          </div>

          {/* Program Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
              <div className="size-10 rounded-xl bg-gold-primary/20 flex items-center justify-center text-gold-primary mb-3">
                <span className="material-symbols-outlined">emoji_events</span>
              </div>
              <h4 className="font-bold text-base text-gray-900 mb-1">Handcrafted 24K Trophy</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                A custom solid-metal trophy forged exclusively for India's champion squad, presented on the live broadcast stage.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
              <div className="size-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-3">
                <span className="material-symbols-outlined">podium</span>
              </div>
              <h4 className="font-bold text-base text-gray-900 mb-1">Dual Qualifying Path</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Top scrim winners earn direct qualifying berths, while open brackets allow rising grassroots squads to fight their way in.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
              <div className="size-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 mb-3">
                <span className="material-symbols-outlined">live_tv</span>
              </div>
              <h4 className="font-bold text-base text-gray-900 mb-1">Full Broadcast Production</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Official YouTube and platform multi-camera feed with casters, slow-mo replays, and real-time kill feed graphics.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}