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

  // Helper to render each video card slot (4 slots total; YouTube video unavailable fallback if unassigned)
  const renderCardSlot = (slotItem, slotNumber) => {
    const isLive = slotItem && slotItem.url && !slotItem.isUnavailable && !slotItem.isDefault;
    const embedUrl = isLive ? getYouTubeEmbedUrl(slotItem.url) : null;

    return (
      <div
        key={`card-slot-${slotNumber}-${slotItem?.id || slotNumber}`}
        className={`group relative h-full overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-1.5 transition-all duration-300 ease-out border flex flex-col justify-between transform-gpu will-change-transform ${
          isLive ? 'border-red-500/70 ring-1 ring-red-500/30' : 'border-black/10 hover:border-gold-primary/50'
        }`}
      >
        <div>
          {/* Active Live Video Player or "YouTube video unavailable" Placeholder */}
          {isLive && embedUrl ? (
            <div className="relative w-full aspect-[16/9] bg-black overflow-hidden rounded-t-2xl">
              <iframe
                src={embedUrl}
                title={slotItem.title || `Slot ${slotNumber} Video`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              {/* Live Badge */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md pointer-events-none bg-red-600 text-white">
                <span className="size-1.5 rounded-full bg-white animate-ping"></span>
                <span>LIVE • SLOT {slotNumber}</span>
              </div>
              <div className="absolute top-2.5 right-2.5 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded text-[9.5px] font-mono font-bold text-gold-primary pointer-events-none">
                {slotItem.game || 'BGMI'}
              </div>
            </div>
          ) : (
            <div className="relative w-full aspect-[16/9] bg-[#0E0F12] border-b border-white/10 flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden rounded-t-2xl">
              <div className="size-11 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-500 mb-2 shadow-inner">
                <span className="material-symbols-outlined text-[24px]">smart_display</span>
              </div>
              <h4 className="text-[12px] font-bold text-gray-200 uppercase tracking-wide">
                YouTube video unavailable
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Standby for Slot {slotNumber} &bull; Awaiting Live Match Feed
              </p>
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-amber-300 border border-amber-400/30 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 pointer-events-none">
                <span className="material-symbols-outlined text-[11px] text-amber-400">hourglass_empty</span>
                <span>STANDBY • SLOT {slotNumber}</span>
              </div>
              <div className="absolute top-2.5 right-2.5 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono font-bold text-gray-400 pointer-events-none">
                {slotItem?.game || 'BGMI'}
              </div>
            </div>
          )}

          {/* Card Content & Details (ZERO viewer count per user specification) */}
          <div className="flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border flex items-center gap-1 ${
                  isLive
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                }`}
              >
                {isLive ? (
                  <>
                    <span className="size-1.5 rounded-full bg-red-600 animate-pulse"></span>
                    ACTIVE LIVE STREAM
                  </>
                ) : (
                  <>
                    <span className="size-1.5 rounded-full bg-gray-400"></span>
                    UNAVAILABLE • STANDBY
                  </>
                )}
              </span>
              <span className="text-[10px] font-mono font-bold text-gray-400">
                Slot #{slotNumber}
              </span>
            </div>

            <h3 className="text-sm font-black text-gray-900 group-hover:text-gold-primary transition-colors line-clamp-1">
              {slotItem?.title || `Live Broadcast Channel Slot ${slotNumber}`}
            </h3>

            <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
              {isLive
                ? 'Official live broadcast channel authorized by Admin. Watch real-time match stream, player action, and tournament gameplay.'
                : 'Broadcast stream currently in standby. Once Admin verifies the incoming YouTube link and caster email, live stream starts immediately.'}
            </p>

            {/* Host, Clan & Game Metadata */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] text-gray-500 pt-1">
              <span>Host: <strong className="text-gray-800">{slotItem?.organizer || 'Live Caster'}</strong></span>
              <span>&bull;</span>
              <span>Clan: <strong className="text-gray-800">{slotItem?.clan || 'OFFICIAL'}</strong></span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono">
              <span>Game: <strong className="text-blue-600">{slotItem?.game || 'BGMI'}</strong></span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-100 mt-2 gap-2">
          {isLive && slotItem?.url ? (
            <a
              href={slotItem.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10.5px] font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[13px]">live_tv</span>
              <span>Watch Live ↗</span>
            </a>
          ) : (
            <span className="px-2.5 py-1 rounded bg-gray-100 text-gray-500 text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">videocam_off</span>
              Video Unavailable
            </span>
          )}

          <button
            onClick={() => {
              if (onNavigate) onNavigate('tournaments');
            }}
            className="text-[10.5px] font-bold text-gray-700 hover:text-gold-primary transition-colors flex items-center gap-0.5 cursor-pointer ml-auto"
          >
            <span>Tournaments &rarr;</span>
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
                Organize, broadcast, and monetize your esports tournaments directly on LiveTournaments.in. 4 active encoding channels stream live match feeds with real-time room codes and verified caster links.
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

          {/* 4-SLOT SEQUENTIAL VIDEO HOSTING GRID (Slots 1, 2, 3, 4 with zero viewers count & YouTube video unavailable standby) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2 pb-6">
            {renderCardSlot(cardSlots[0], 1)}
            {renderCardSlot(cardSlots[1], 2)}
            {renderCardSlot(cardSlots[2], 3)}
            {renderCardSlot(cardSlots[3], 4)}
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
                Choose your hosting package: Weekly (₹249), Pro 15-Day (₹549), or Monthly (₹999). Host everyday with first tournament FREE OF COST and your live stream showcased across all 4 channels!
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
