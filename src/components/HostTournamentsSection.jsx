import React from 'react';

export default function HostTournamentsSection({ onNavigate }) {
  const handleHostRedirect = () => {
    if (onNavigate) {
      onNavigate('user-dashboard');
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
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-primary text-black shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">gallery_thumbnail</span>
                  Media &amp; Broadcasting
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Creator &amp; Clan Studio
                </span>
              </div>

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div
              onClick={handleHostRedirect}
              className="group relative h-full overflow-hidden bg-white rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5 flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full aspect-[441/225] overflow-hidden bg-dark-default">
                  <img
                    alt="Host Your Live Tournaments Directly With Us"
                    loading="lazy"
                    decoding="async"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl w-full h-full"
                    src="/assets/host_directly_4k.jpg"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-gold-primary uppercase tracking-wider">
                    Paid Hosting Tier
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-5">
                  <h3 className="text-dark-default primary-bold-s18-lh120 group-hover:text-gold-primary transition-colors">
                    Host Your Live Tournaments Directly With Us
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Set entry fees, define custom prize distributions, and let our engine handle player registrations and room code distribution.
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">LiveTournaments.in</span>
                <span className="text-xs font-bold text-black group-hover:text-gold-primary flex items-center gap-1">
                  Start Now &rarr;
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div
              onClick={handleHostRedirect}
              className="group relative h-full overflow-hidden bg-white rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5 flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full aspect-[441/225] overflow-hidden bg-dark-default">
                  <img
                    alt="Launch with Our Expert Pilots and Production Teams"
                    loading="lazy"
                    decoding="async"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl w-full h-full"
                    src="/assets/experienced_pilot_4k.jpg"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                    Official Referees
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-5">
                  <h3 className="text-dark-default primary-bold-s18-lh120 group-hover:text-gold-primary transition-colors">
                    Launch with Our Expert Pilots &amp; Referees
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Certified tournament pilots supervise your matches in real time, preventing illegal teaming and managing drop timings.
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">LiveTournaments.in</span>
                <span className="text-xs font-bold text-black group-hover:text-gold-primary flex items-center gap-1">
                  Book Referees &rarr;
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div
              onClick={handleHostRedirect}
              className="group relative h-full overflow-hidden bg-white rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5 flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full aspect-[441/225] overflow-hidden bg-dark-default">
                  <img
                    alt="Give Your Event a Professional Broadcaster Polish"
                    loading="lazy"
                    decoding="async"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl w-full h-full"
                    src="/assets/professional_quality_4k.jpg"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                    Broadcaster Stream
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-5">
                  <h3 className="text-dark-default primary-bold-s18-lh120 group-hover:text-gold-primary transition-colors">
                    Give Your Event a Professional Broadcaster Polish
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Full HD multi-camera production overlays, live tournament leaderboard graphics, and direct RTMP YouTube broadcast integration.
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">LiveTournaments.in</span>
                <span className="text-xs font-bold text-black group-hover:text-gold-primary flex items-center gap-1">
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
                Choose your hosting package starting at ₹149. Complete with verified UPI gateway payment collection, instant slot approval, and Super Admin verification.
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