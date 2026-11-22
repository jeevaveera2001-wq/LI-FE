import React, { useState, useEffect } from 'react';
import { getYouTubeEmbedUrl } from '../utils/urlValidator';
import { getCardSlotsFromStorage } from '../utils/broadcastSlots';

export default function HostTournamentsSection({ onNavigate, currentUser }) {
  const [cardSlots, setCardSlots] = useState(() => getCardSlotsFromStorage());

  useEffect(() => {
    const handleUpdate = () => {
      setCardSlots(getCardSlotsFromStorage());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('lt_tournament_hosted', handleUpdate);
    window.addEventListener('lt_stream_updated', handleUpdate);
    window.addEventListener('lt_broadcast_approved', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('lt_tournament_hosted', handleUpdate);
      window.removeEventListener('lt_stream_updated', handleUpdate);
      window.removeEventListener('lt_broadcast_approved', handleUpdate);
    };
  }, []);

  const handleHostRedirect = () => {
    if (!currentUser) {
      if (onNavigate) onNavigate('login');
      return;
    }
    if (onNavigate) {
      onNavigate('user-dashboard', 'broadcast');
    }
  };

  // Helper to render each video card slot (NO viewers count, active video embed, never empty theme)
  const renderCardSlot = (slotItem, slotNumber) => {
    const embedUrl = getYouTubeEmbedUrl(slotItem.url);
    const isLive = !slotItem.isDefault;

    return (
      <div
        key={`card-slot-${slotNumber}-${slotItem.id || slotItem.url}`}
        className={`group relative h-full overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-1.5 transition-all duration-300 ease-out border flex flex-col justify-between transform-gpu will-change-transform ${
          isLive ? 'border-gold-primary/70 ring-1 ring-gold-primary/30' : 'border-black/10 hover:border-gold-primary/50'
        }`}
      >
        <div>
          {/* Active Video Player Embed (Never empty theme, plays live or standby video) */}
          <div className="relative w-full aspect-[16/9] bg-black overflow-hidden rounded-t-2xl">
            <iframe
              src={embedUrl}
              title={slotItem.title || `Slot ${slotNumber} Video`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {/* Live or Standby Status Badge */}
            <div
              className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md pointer-events-none ${
                isLive ? 'bg-red-600 text-white' : 'bg-black/80 backdrop-blur-md text-gold-primary border border-gold-primary/40'
              }`}
            >
              {isLive ? (
                <>
                  <span className="size-1.5 rounded-full bg-white animate-ping"></span>
                  <span>LIVE • SLOT {slotNumber}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[12px] text-gold-primary">play_circle</span>
                  <span>STANDBY VIDEO • SLOT {slotNumber}</span>
                </>
              )}
            </div>

            <div className="absolute top-2.5 right-2.5 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-gold-primary pointer-events-none">
              {slotItem.game || 'BGMI'}
            </div>
          </div>

          {/* Card Content & Details (ZERO viewer count per user specification) */}
          <div className="flex flex-col gap-2 p-5">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border flex items-center gap-1 ${
                  isLive
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {isLive ? (
                  <>
                    <span className="size-1.5 rounded-full bg-red-600 animate-pulse"></span>
                    ACTIVE LIVE STREAM
                  </>
                ) : (
                  <>
                    <span className="size-1.5 rounded-full bg-amber-500"></span>
                    UPCOMING ARENA STREAM
                  </>
                )}
              </span>
              <span className="text-[11px] font-mono text-gray-500">
                Slot #{slotNumber}
              </span>
            </div>

            <h3 className="text-base font-black text-gray-900 group-hover:text-gold-primary transition-colors line-clamp-1">
              {slotItem.title}
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
              {isLive
                ? 'Official live broadcast channel authorized by Admin. Watch live match stream, commentary, and room action in real time.'
                : 'Dedicated esports tournament streaming slot. Watch official gameplay broadcast, daily scrims production, or stream highlights.'}
            </p>

            {/* Host and Clan Details - NO Viewers Count */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 pt-1">
              <span>Host: <strong className="text-gray-800">{slotItem.organizer || 'Verified Host'}</strong></span>
              <span>&bull;</span>
              <span>Clan: <strong className="text-gray-800">{slotItem.clan || 'OFFICIAL'}</strong></span>
              <span>&bull;</span>
              <span>Game: <strong className="text-gray-800">{slotItem.game || 'BGMI'}</strong></span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2 gap-2">
          <a
            href={slotItem.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">live_tv</span>
            <span>YouTube ↗</span>
          </a>

          <button
            onClick={() => {
              if (onNavigate) onNavigate('tournaments');
            }}
            className="px-4 py-1.5 rounded-lg bg-black hover:bg-gold-primary text-white hover:text-black text-[11px] font-black uppercase tracking-wider transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <span>Join Match</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <section
      id="host-tournaments-section"
      data-section="media"
      className="relative block-default-horizontal-spacing block-default-vertical-spacing scroll-mt-20"
    >
      {/* Anchor for direct #media link support */}
      <span id="media" className="absolute -top-24 block invisible pointer-events-none" />

      <div className="block-default-content-width mx-auto">
        <div className="relative flex flex-col gap-6 md:gap-8">
          
          {/* Header Title & Subtitle */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="text-dark-default section-title flex w-full flex-col gap-2 normal-case text-left">
              <h2 className="primary-bold-s26-lh110 md:primary-bold-s32-lh100 lg:primary-bold-s38-lh100 xl:primary-bold-s42-lh90">
                Host Your Tournaments
              </h2>

              <p className="primary-regular-s14-lh120 md:primary-regular-s18-lh120 lg:primary-regular-s20-lh120 text-[#6B6B6B] max-w-3xl">
                Organize, broadcast, and monetize your esports tournaments directly on LiveTournaments.in. Each approved broadcast dynamically streams inside its dedicated card slot below.
              </p>
            </div>

            {/* Launch Tournament Primary Button */}
            <div className="shrink-0">
              <button
                onClick={handleHostRedirect}
                className="px-6 py-3.5 rounded-xl bg-black text-white hover:bg-gold-primary hover:text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>OPEN HOSTING STUDIO</span>
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
              </button>
            </div>
          </div>

          {/* 3-CARD SEQUENTIAL VIDEO HOSTING GRID (Slots 1, 2, 3 with zero viewers count & zero empty theme) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 pb-6">
            {renderCardSlot(cardSlots[0], 1)}
            {renderCardSlot(cardSlots[1], 2)}
            {renderCardSlot(cardSlots[2], 3)}
          </div>

          {/* Paid Hosting Workflow CTA Banner */}
          <div className="bg-gradient-to-r from-dark-default via-black to-dark-default text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gold-primary/30 shadow-xl">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="text-gold-primary font-bold text-xs uppercase tracking-widest">
                Integrated Paid Hosting &bull; Tier 1 to Tier 3
              </span>
              <h3 className="text-xl md:text-2xl font-black">
                Ready to Host Your Own Tournament on LiveTournaments?
              </h3>
              <p className="text-xs md:text-sm text-gray-300">
                Choose your hosting package: Weekly (₹249), Pro 15-Day (₹549), or Monthly (₹999). Host everyday with first tournament FREE OF COST and your live stream showcased!
              </p>
            </div>

            <button
              onClick={handleHostRedirect}
              className="px-6 py-3.5 rounded-xl bg-gold-primary hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg whitespace-nowrap cursor-pointer shrink-0"
            >
              GO TO USER HOSTING STUDIO &rarr;
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
