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

          {/* Single Card Layout per User Specification */}
          <div className="pt-2 pb-6">
            {userHostedTourneys.length > 0 ? (
              <div
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('tournaments');
                  }
                }}
                className="group relative overflow-hidden bg-white rounded-2xl cursor-pointer shadow-md hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-1 transition-all duration-300 ease-out border border-gold-primary/50 flex flex-col md:flex-row justify-between transform-gpu will-change-transform"
              >
                <div className="relative w-full md:w-5/12 aspect-[16/9] md:aspect-auto overflow-hidden bg-dark-default min-h-[220px]">
                  <img
                    alt={userHostedTourneys[0].title || 'Community Hosted Tournament'}
                    loading="lazy"
                    decoding="async"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-hover:brightness-105 w-full h-full"
                    src={userHostedTourneys[0].thumbnail || userHostedTourneys[0].poster || '/assets/host_directly_4k.jpg'}
                  />
                  <div className="absolute top-3 left-3 bg-[#DFBD78] text-black px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider shadow-sm">
                    Community Hosted Match
                  </div>
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono font-bold text-white">
                    {userHostedTourneys[0].game || 'BGMI'}
                  </div>
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                        {userHostedTourneys[0].type || 'TOURNAMENT'}
                      </span>
                      <span className="text-xs font-mono text-gray-500">
                        {userHostedTourneys[0].timing || 'Upcoming Today'}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-gold-primary transition-colors">
                      {userHostedTourneys[0].title}
                    </h3>

                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                      Entry Fee: <strong className="text-black">{userHostedTourneys[0].entryFee || '₹10 - ₹50'}</strong> &bull; Prize Pool: <strong className="text-emerald-600">{userHostedTourneys[0].prizePool || userHostedTourneys[0].prize || '₹50,000 INR'}</strong>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                      <span>Host: <strong className="text-gray-800">{userHostedTourneys[0].organizer || userHostedTourneys[0].hostUser || 'Verified Host'}</strong></span>
                      <span>&bull;</span>
                      <span>Slots: <strong className="text-gray-800">{userHostedTourneys[0].slots || '25 Squads (100 Players)'}</strong></span>
                      {userHostedTourneys[0].whatsApp && (
                        <>
                          <span>&bull;</span>
                          <span>WhatsApp: <strong className="text-emerald-700">{userHostedTourneys[0].whatsApp}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Registration Open
                      </span>
                      {userHostedTourneys[0].channelLink && (
                        <a
                          href={userHostedTourneys[0].channelLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[13px]">live_tv</span>
                          <span>Stream Live ↗</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHostRedirect();
                        }}
                        className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all cursor-pointer"
                      >
                        + Host Another Match
                      </button>
                      <span className="px-5 py-2 rounded-xl bg-black group-hover:bg-gold-primary text-white group-hover:text-black text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md">
                        <span>Join Match</span>
                        <span>&rarr;</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={handleHostRedirect}
                className="group relative overflow-hidden bg-white rounded-2xl cursor-pointer shadow-md hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-1 transition-all duration-300 ease-out border border-gold-primary/30 flex flex-col md:flex-row justify-between transform-gpu will-change-transform"
              >
                <div className="relative w-full md:w-5/12 aspect-[16/9] md:aspect-auto overflow-hidden bg-dark-default min-h-[220px]">
                  <img
                    alt="Host Your Live Tournaments Directly With Us"
                    loading="lazy"
                    decoding="async"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-hover:brightness-105 w-full h-full"
                    src="/assets/host_directly_4k.jpg"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-gold-primary uppercase tracking-wider group-hover:scale-105 transition-transform duration-300">
                    Host Everyday • 1st Free of Cost
                  </div>
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                        OFFICIAL ESPORTS HOSTING
                      </span>
                      <span className="text-xs font-mono text-gray-500">LiveTournaments.in Production</span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-gold-primary transition-colors">
                      Host Your Live Tournaments Directly With Us
                    </h3>

                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-2xl">
                      Set entry fees, define custom prize distributions, and let our engine handle player registrations, room code distribution, automated referee pilots, and YouTube live broadcast streaming.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1 font-mono">
                      <span>✓ Automated Room Credentials</span>
                      <span>✓ Official Referee Supervision</span>
                      <span>✓ Live YouTube Broadcast Integration</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Single Match: ₹10 &bull; Daily Scrims: ₹50
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHostRedirect();
                      }}
                      className="px-6 py-2.5 rounded-xl bg-black group-hover:bg-gold-primary text-white group-hover:text-black text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <span>Open Hosting Studio</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
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