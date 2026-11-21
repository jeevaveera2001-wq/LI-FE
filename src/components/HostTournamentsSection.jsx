import React, { useState, useEffect } from 'react';

export default function HostTournamentsSection({ onNavigate, currentUser }) {
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
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('lt_tournament_hosted', handleUpdate);
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
                Organize, broadcast, and monetize your esports tournaments directly on LiveTournaments.in. Complete with automated room keys, referee pilots, and high-definition media production.
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

          {/* 3 Pillars / Media Showcase Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 pb-6">
            
            {/* Card 1: User Requested Tournament or Default Hosting Tier Card */}
            {userHostedTourneys.length > 0 ? (
              <div
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('tournaments');
                  }
                }}
                className="group relative h-full overflow-hidden bg-white rounded-2xl cursor-pointer shadow-md hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-2 hover:scale-[1.025] relative z-0 hover:z-20 hover:border-gold-primary hover:ring-2 hover:ring-gold-primary/50 transition-all duration-300 ease-out border border-gold-primary/40 flex flex-col justify-between transform-gpu will-change-transform"
              >
                <div>
                  <div className="relative w-full aspect-[441/225] overflow-hidden bg-dark-default">
                    <img
                      alt={userHostedTourneys[0].title || 'Community Hosted Tournament'}
                      loading="lazy"
                      decoding="async"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-108 group-hover:brightness-105 rounded-t-2xl w-full h-full transform-gpu"
                      src={userHostedTourneys[0].thumbnail || userHostedTourneys[0].poster || '/assets/host_directly_4k.jpg'}
                    />
                    <div className="absolute top-3 left-3 bg-[#DFBD78] text-black px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider shadow-sm">
                      Community Hosted Match
                    </div>
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white">
                      {userHostedTourneys[0].game || 'BGMI'}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-5">
                    <h3 className="text-dark-default primary-bold-s18-lh120 group-hover:text-gold-primary transition-colors duration-200">
                      {userHostedTourneys[0].title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Entry Fee: <strong className="text-black">{userHostedTourneys[0].entryFee || '₹50'}</strong> &bull; Prize Pool: <strong className="text-emerald-600">{userHostedTourneys[0].prizePool || '₹50,000'}</strong>
                    </p>
                    <span className="text-[11px] text-gray-500 font-mono">
                      Host: {userHostedTourneys[0].organizer || userHostedTourneys[0].host || 'Community Host'}
                    </span>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Registration Open
                  </span>
                  <span className="text-xs font-bold text-black group-hover:text-gold-primary flex items-center gap-1 transition-all group-hover:translate-x-1">
                    Join Match &rarr;
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={handleHostRedirect}
                className="group relative h-full overflow-hidden bg-white rounded-2xl cursor-pointer shadow-md hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-2 hover:scale-[1.025] relative z-0 hover:z-20 hover:border-gold-primary hover:ring-2 hover:ring-gold-primary/50 transition-all duration-300 ease-out border border-black/10 flex flex-col justify-between transform-gpu will-change-transform"
              >
                <div>
                  <div className="relative w-full aspect-[441/225] overflow-hidden bg-dark-default">
                    <img
                      alt="Host Your Live Tournaments Directly With Us"
                      loading="lazy"
                      decoding="async"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-108 group-hover:brightness-105 rounded-t-2xl w-full h-full transform-gpu"
                      src="/assets/host_directly_4k.jpg"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-gold-primary uppercase tracking-wider group-hover:scale-105 transition-transform duration-300">
                      Paid Hosting Tier
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-5">
                    <h3 className="text-dark-default primary-bold-s18-lh120 group-hover:text-gold-primary transition-colors duration-200">
                      Host Your Live Tournaments Directly With Us
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Set entry fees, define custom prize distributions, and let our engine handle player registrations and room code distribution.
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">LiveTournaments.in</span>
                  <span className="text-xs font-bold text-black group-hover:text-gold-primary flex items-center gap-1 transition-all group-hover:translate-x-1">
                    Start Now &rarr;
                  </span>
                </div>
              </div>
            )}

            {/* Card 2 */}
            <div
              onClick={handleHostRedirect}
              className="group relative h-full overflow-hidden bg-white rounded-2xl cursor-pointer shadow-md hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-2 hover:scale-[1.025] relative z-0 hover:z-20 hover:border-gold-primary hover:ring-2 hover:ring-gold-primary/50 transition-all duration-300 ease-out border border-black/10 flex flex-col justify-between transform-gpu will-change-transform"
            >
              <div>
                <div className="relative w-full aspect-[441/225] overflow-hidden bg-dark-default">
                  <img
                    alt="Launch with Our Expert Pilots and Production Teams"
                    loading="lazy"
                    decoding="async"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-108 group-hover:brightness-105 rounded-t-2xl w-full h-full transform-gpu"
                    src="/assets/experienced_pilot_4k.jpg"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-blue-400 uppercase tracking-wider group-hover:scale-105 transition-transform duration-300">
                    Official Referees
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-5">
                  <h3 className="text-dark-default primary-bold-s18-lh120 group-hover:text-gold-primary transition-colors duration-200">
                    Launch with Our Expert Pilots &amp; Referees
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Certified tournament pilots supervise your matches in real time, preventing illegal teaming and managing drop timings.
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">LiveTournaments.in</span>
                <span className="text-xs font-bold text-black group-hover:text-gold-primary flex items-center gap-1 transition-all group-hover:translate-x-1">
                  Book Referees &rarr;
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div
              onClick={handleHostRedirect}
              className="group relative h-full overflow-hidden bg-white rounded-2xl cursor-pointer shadow-md hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-2 hover:scale-[1.025] relative z-0 hover:z-20 hover:border-gold-primary hover:ring-2 hover:ring-gold-primary/50 transition-all duration-300 ease-out border border-black/10 flex flex-col justify-between transform-gpu will-change-transform"
            >
              <div>
                <div className="relative w-full aspect-[441/225] overflow-hidden bg-dark-default">
                  <img
                    alt="Give Your Event a Professional Broadcaster Polish"
                    loading="lazy"
                    decoding="async"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-108 group-hover:brightness-105 rounded-t-2xl w-full h-full transform-gpu"
                    src="/assets/professional_quality_4k.jpg"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-purple-400 uppercase tracking-wider group-hover:scale-105 transition-transform duration-300">
                    Broadcaster Stream
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-5">
                  <h3 className="text-dark-default primary-bold-s18-lh120 group-hover:text-gold-primary transition-colors duration-200">
                    Give Your Event a Professional Broadcaster Polish
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Full HD multi-camera production overlays, live tournament leaderboard graphics, and direct RTMP YouTube broadcast integration.
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">LiveTournaments.in</span>
                <span className="text-xs font-bold text-black group-hover:text-gold-primary flex items-center gap-1 transition-all group-hover:translate-x-1">
                  Media Feeds &rarr;
                </span>
              </div>
            </div>

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