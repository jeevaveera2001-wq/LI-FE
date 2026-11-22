import React, { useState, useEffect } from 'react';
import { getYouTubeEmbedUrl } from '../utils/urlValidator';

export default function HostTournamentsSection({ onNavigate, currentUser }) {
  const [approvedBroadcasts, setApprovedBroadcasts] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('lt_approved_broadcasts') || '[]');
      if (Array.isArray(stored) && stored.length > 0) return stored;
      const single = JSON.parse(localStorage.getItem('lt_approved_live_stream') || 'null');
      if (single && single.url) return [single];
    } catch (e) {}
    return [];
  });

  const [userHostedTourneys, setUserHostedTourneys] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('lt_user_hosted_tourneys') || '[]');
      if (Array.isArray(stored) && stored.length > 0) return stored;
      const adminReqs = JSON.parse(localStorage.getItem('lt_admin_hosting_requests') || '[]');
      if (Array.isArray(adminReqs) && adminReqs.length > 0) return adminReqs;
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const storedBroadcasts = JSON.parse(localStorage.getItem('lt_approved_broadcasts') || '[]');
        if (Array.isArray(storedBroadcasts) && storedBroadcasts.length > 0) {
          setApprovedBroadcasts(storedBroadcasts);
        } else {
          const single = JSON.parse(localStorage.getItem('lt_approved_live_stream') || 'null');
          if (single && single.url) {
            setApprovedBroadcasts([single]);
          } else {
            setApprovedBroadcasts([]);
          }
        }

        const stored = JSON.parse(localStorage.getItem('lt_user_hosted_tourneys') || '[]');
        if (Array.isArray(stored) && stored.length > 0) {
          setUserHostedTourneys(stored);
          return;
        }
        const adminReqs = JSON.parse(localStorage.getItem('lt_admin_hosting_requests') || '[]');
        if (Array.isArray(adminReqs) && adminReqs.length > 0) {
          setUserHostedTourneys(adminReqs);
        }
      } catch (e) {}
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

  // Helper to render an approved live video broadcast card slot
  const renderLiveStreamCard = (stream, slotNumber, defaultViewers = 16840) => {
    const embedUrl = getYouTubeEmbedUrl(stream.url);
    const viewersCount = stream.viewers ? Number(stream.viewers).toLocaleString() : Number(defaultViewers).toLocaleString();

    return (
      <div
        key={`slot-live-${slotNumber}-${stream.id || stream.url}`}
        className="group relative h-full overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-1.5 transition-all duration-300 ease-out border border-gold-primary/60 flex flex-col justify-between transform-gpu will-change-transform"
      >
        <div>
          {/* Live Video Player Embed */}
          <div className="relative w-full aspect-[16/9] bg-black overflow-hidden rounded-t-2xl">
            <iframe
              src={embedUrl}
              title={stream.title || `Live Broadcast Slot ${slotNumber}`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {/* Live Status Overlay Badge */}
            <div className="absolute top-2.5 left-2.5 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md pointer-events-none">
              <span className="size-1.5 rounded-full bg-white animate-ping"></span>
              <span>LIVE • SLOT {slotNumber}</span>
            </div>
            <div className="absolute top-2.5 right-2.5 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-gold-primary pointer-events-none">
              {stream.game || 'BGMI'}
            </div>
          </div>

          {/* Stream Information */}
          <div className="flex flex-col gap-2 p-5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-red-600 animate-pulse"></span>
                ON AIR BROADCAST
              </span>
              <span className="text-[11px] font-mono text-gray-500">
                Authorized Stream
              </span>
            </div>

            <h3 className="text-base font-black text-gray-900 group-hover:text-gold-primary transition-colors line-clamp-1">
              {stream.title || `Live Match Stream - Slot ${slotNumber}`}
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
              Official live broadcast channel authorized by Super Admin. Watch stream, chat, and room match progression.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 pt-1">
              <span>Host: <strong className="text-gray-800">{stream.organizer || 'Verified Host'}</strong></span>
              <span>&bull;</span>
              <span>Clan: <strong className="text-gray-800">{stream.clan || 'OFFICIAL'}</strong></span>
              <span>&bull;</span>
              <span className="text-emerald-700 font-bold">👥 {viewersCount} Viewers</span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2 gap-2">
          <a
            href={stream.url}
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

          {/* 3-CARD SEQUENTIAL HOST & LIVE BROADCAST GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 pb-6">
            
            {/* ================= CARD SLOT 1 ================= */}
            {approvedBroadcasts[0] ? (
              renderLiveStreamCard(approvedBroadcasts[0], 1, 16840)
            ) : userHostedTourneys.length > 0 ? (
              <div
                onClick={() => {
                  if (onNavigate) onNavigate('tournaments');
                }}
                className="group relative h-full overflow-hidden bg-white rounded-2xl cursor-pointer shadow-md hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-1.5 transition-all duration-300 ease-out border border-gold-primary/50 flex flex-col justify-between transform-gpu will-change-transform"
              >
                <div>
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-dark-default">
                    <img
                      alt={userHostedTourneys[0].title || 'Community Hosted Tournament'}
                      loading="lazy"
                      decoding="async"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-108 group-hover:brightness-105 w-full h-full transform-gpu"
                      src={userHostedTourneys[0].thumbnail || userHostedTourneys[0].poster || '/assets/host_directly_4k.jpg'}
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#DFBD78] text-black px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider shadow-sm">
                      Slot 1 &bull; Community Match
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white">
                      {userHostedTourneys[0].game || 'BGMI'}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                        {userHostedTourneys[0].type || 'TOURNAMENT'}
                      </span>
                      <span className="text-[11px] font-mono text-gray-500">
                        {userHostedTourneys[0].timing || 'Upcoming Today'}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-gray-900 group-hover:text-gold-primary transition-colors line-clamp-1">
                      {userHostedTourneys[0].title}
                    </h3>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      Entry: <strong className="text-black">{userHostedTourneys[0].entryFee || '₹10 - ₹50'}</strong> &bull; Prize: <strong className="text-emerald-600">{userHostedTourneys[0].prizePool || userHostedTourneys[0].prize || '₹50,000 INR'}</strong>
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 pt-1">
                      <span>Host: <strong className="text-gray-800">{userHostedTourneys[0].organizer || userHostedTourneys[0].hostUser || 'Verified Host'}</strong></span>
                      <span>&bull;</span>
                      <span>Slots: <strong className="text-gray-800">{userHostedTourneys[0].slots || '25 Squads'}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Open
                  </span>
                  <span className="text-xs font-bold text-black group-hover:text-gold-primary flex items-center gap-1 transition-all group-hover:translate-x-1">
                    Join Match &rarr;
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={handleHostRedirect}
                className="group relative h-full overflow-hidden bg-white rounded-2xl cursor-pointer shadow-md hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-1.5 transition-all duration-300 ease-out border border-black/10 hover:border-gold-primary flex flex-col justify-between transform-gpu will-change-transform"
              >
                <div>
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-dark-default">
                    <img
                      alt="Host Your Live Tournaments Directly With Us"
                      loading="lazy"
                      decoding="async"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-108 group-hover:brightness-105 w-full h-full transform-gpu"
                      src="/assets/host_directly_4k.jpg"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-gold-primary uppercase tracking-wider">
                      Slot 1 &bull; Pro Hosting
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                        OFFICIAL HOSTING
                      </span>
                      <span className="text-[11px] font-mono text-gray-500">Tier 1 Production</span>
                    </div>
                    <h3 className="text-base font-black text-gray-900 group-hover:text-gold-primary transition-colors">
                      Host Your Live Tournaments Directly With Us
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      Set entry fees, define custom prize distributions, and let our engine handle player registrations, room code distribution, automated referee pilots, and YouTube live broadcast streaming.
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                  <span className="text-[11px] font-bold text-gray-500">₹10 / Match &bull; 1st Free</span>
                  <span className="text-xs font-bold text-black group-hover:text-gold-primary flex items-center gap-1 transition-all group-hover:translate-x-1">
                    Open Studio &rarr;
                  </span>
                </div>
              </div>
            )}

            {/* ================= CARD SLOT 2 ================= */}
            {approvedBroadcasts[1] ? (
              renderLiveStreamCard(approvedBroadcasts[1], 2, 14250)
            ) : (
              <div
                onClick={handleHostRedirect}
                className="group relative h-full overflow-hidden bg-white rounded-2xl cursor-pointer shadow-md hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-1.5 transition-all duration-300 ease-out border border-black/10 hover:border-gold-primary flex flex-col justify-between transform-gpu will-change-transform"
              >
                <div>
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-dark-default">
                    <img
                      alt="Launch with Our Expert Pilots & Referees"
                      loading="lazy"
                      decoding="async"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-108 group-hover:brightness-105 w-full h-full transform-gpu"
                      src="/assets/expert_pilots_4k.jpg"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-gold-primary uppercase tracking-wider">
                      Slot 2 &bull; Daily Scrims Arena
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">
                        OFFICIAL REFEREES
                      </span>
                      <span className="text-[11px] font-mono text-gray-500">Tier 2 Supervision</span>
                    </div>
                    <h3 className="text-base font-black text-gray-900 group-hover:text-gold-primary transition-colors">
                      Launch with Our Expert Pilots &amp; Referees
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      Certified tournament pilots supervise your matches in real time, preventing illegal teaming, managing drop timings, and validating fair play results.
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                  <span className="text-[11px] font-bold text-gray-500">Match Pilots &bull; Anti-Cheat</span>
                  <span className="text-xs font-bold text-black group-hover:text-gold-primary flex items-center gap-1 transition-all group-hover:translate-x-1">
                    Host Scrim &rarr;
                  </span>
                </div>
              </div>
            )}

            {/* ================= CARD SLOT 3 ================= */}
            {approvedBroadcasts[2] ? (
              renderLiveStreamCard(approvedBroadcasts[2], 3, 11900)
            ) : (
              <div
                onClick={handleHostRedirect}
                className="group relative h-full overflow-hidden bg-white rounded-2xl cursor-pointer shadow-md hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-1.5 transition-all duration-300 ease-out border border-black/10 hover:border-gold-primary flex flex-col justify-between transform-gpu will-change-transform"
              >
                <div>
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-dark-default">
                    <img
                      alt="Give Your Event a Professional Broadcaster Polish"
                      loading="lazy"
                      decoding="async"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-108 group-hover:brightness-105 w-full h-full transform-gpu"
                      src="/assets/professional_quality_4k.jpg"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                      Slot 3 &bull; Championship Studio
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                        MEDIA PRODUCTION
                      </span>
                      <span className="text-[11px] font-mono text-gray-500">Tier 3 Broadcast</span>
                    </div>
                    <h3 className="text-base font-black text-gray-900 group-hover:text-gold-primary transition-colors">
                      Give Your Event a Professional Broadcaster Polish
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      Full HD multi-camera production overlays, live tournament leaderboard graphics, and direct RTMP YouTube broadcast integration for maximum reach.
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                  <span className="text-[11px] font-bold text-gray-500">LiveTournaments Production</span>
                  <span className="text-xs font-bold text-black group-hover:text-gold-primary flex items-center gap-1 transition-all group-hover:translate-x-1">
                    Media Feeds &rarr;
                  </span>
                </div>
              </div>
            )}

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
