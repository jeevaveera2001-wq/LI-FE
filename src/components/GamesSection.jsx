import React from 'react';

const GAMES_CATALOG = [
  {
    name: 'Counter-Strike 2',
    genre: 'Tactical FPS',
    logo: 'https://d3h9qea4qy4169.cloudfront.net/cs2_00be38ddd1.png'
  },
  {
    name: 'Valorant',
    genre: 'Hero Shooter',
    logo: 'https://d3h9qea4qy4169.cloudfront.net/Valorant_1710f7c511.png'
  },
  {
    name: 'Fatal Fury: CotW',
    genre: 'Fighting',
    logo: 'https://d3h9qea4qy4169.cloudfront.net/Fatal_Fury_5779ac62be.png'
  },
  {
    name: 'Chess.com',
    genre: 'Strategy',
    logo: 'https://d3h9qea4qy4169.cloudfront.net/chess_logo_v1_8b2f61713b.png'
  },
  {
    name: 'Dota 2',
    genre: 'MOBA',
    logo: 'https://d3h9qea4qy4169.cloudfront.net/dota2_logo_v1_c810ca7889.png'
  }
];

export default function GamesSection() {
  const scrollContainerRef = React.useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative block-default-horizontal-spacing block-default-vertical-spacing bg-white-dirty">
      <div className="block-default-content-width mx-auto">
        <div className="relative flex flex-col gap-5 md:gap-8">
          
          {/* Header Title & Subtitle */}
          <div className="flex items-end justify-between gap-8">
            <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-center">
              <div className="text-dark-default section-title flex w-full flex-col gap-1 normal-case text-left">
                <h2 className="primary-bold-s26-lh110 md:primary-bold-s32-lh100 lg:primary-bold-s38-lh100 xl:primary-bold-s42-lh90">
                  LT.IN 27 Games
                </h2>
                <p className="primary-regular-s14-lh120 md:primary-regular-s18-lh120 lg:primary-regular-s20-lh120 text-[#6B7280]">
                  Every game brings a new battle to the global stage. Keep watch here as we reveal the games that will set the stage for our next chapter.
                </p>
              </div>
            </div>
            
            {/* Scroll Navigation Arrows */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <button
                onClick={scrollLeft}
                aria-label="Scroll left"
                type="button"
                className="size-10 rounded-full border border-gray-200 bg-white hover:border-gold-primary hover:text-gold-primary flex items-center justify-center text-gray-600 transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button
                onClick={scrollRight}
                aria-label="Scroll right"
                type="button"
                className="size-10 rounded-full border border-gray-200 bg-white hover:border-gold-primary hover:text-gold-primary flex items-center justify-center text-gray-600 transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Games Slider with Centralized Cards & Smooth Elevated Hover */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="hide-scrollbar flex gap-4 overflow-x-auto pt-3 pb-6 px-1 scroll-smooth"
              role="region"
              tabIndex="0"
            >
              {GAMES_CATALOG.map((game) => (
                <div
                  key={game.name}
                  className="group relative flex w-[249px] h-[249px] flex-none flex-col items-center justify-between rounded-2xl bg-white p-5 shadow-md hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-2 hover:scale-[1.025] hover:border-gold-primary hover:ring-2 hover:ring-gold-primary/40 relative z-0 hover:z-20 transition-all duration-300 ease-out transform-gpu will-change-transform select-none lg:rounded-3xl cursor-pointer"
                >
                  {/* Top Category Badge */}
                  <div className="w-full flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                    <span className="flex items-center gap-1.5 text-gold-primary">
                      <span className="size-1.5 rounded-full bg-gold-primary"></span>
                      {game.genre}
                    </span>
                    <span className="text-[9px] bg-gray-100 group-hover:bg-gold-primary/10 group-hover:text-gold-primary text-gray-600 px-2 py-0.5 rounded transition-colors font-semibold">
                      FEATURED
                    </span>
                  </div>

                  {/* Perfectly Centralized Game Logo - Smooth Hover Zoom */}
                  <div className="flex-1 flex items-center justify-center w-full px-2 py-3 my-auto overflow-hidden">
                    <img
                      alt={game.name}
                      loading="lazy"
                      width="200"
                      height="120"
                      decoding="async"
                      className="max-h-[115px] max-w-[190px] w-auto h-auto object-contain transition-transform duration-300 ease-out group-hover:scale-110 group-hover:brightness-105 filter drop-shadow-xs pointer-events-none transform-gpu"
                      src={game.logo}
                    />
                  </div>

                  {/* Bottom Game Title & Arrow */}
                  <div className="w-full pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="primary-bold-s14-lh120 text-dark-default group-hover:text-gold-primary transition-colors truncate">
                      {game.name}
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-gray-400 group-hover:text-gold-primary group-hover:translate-x-0.5 transition-all">
                      arrow_forward
                    </span>
                  </div>
                </div>
              ))}

              {/* More Tournaments Planned Card */}
              <div className="group relative flex w-[249px] h-[249px] flex-none flex-col justify-between rounded-2xl bg-white p-5 shadow-md hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-2 hover:scale-[1.025] hover:border-gold-primary/80 hover:ring-2 hover:ring-gold-primary/30 relative z-0 hover:z-20 transition-all duration-300 ease-out transform-gpu will-change-transform select-none lg:rounded-3xl border border-dashed border-gray-200 text-center cursor-pointer">
                <div className="w-full flex items-center justify-end text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[9px]">
                    UPCOMING
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center flex-1 my-auto px-2">
                  <div className="size-12 rounded-2xl bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center text-gold-primary mb-2.5 shadow-xs">
                    <img
                      alt="Upcoming Games"
                      loading="lazy"
                      width="28"
                      height="28"
                      decoding="async"
                      className="size-7 object-contain opacity-80"
                      src="https://d3h9qea4qy4169.cloudfront.net/quest_c164a01d20.png"
                    />
                  </div>
                  <p className="primary-bold-s14-lh120 text-dark-default uppercase tracking-tight">
                    More Tournaments
                  </p>
                  <p className="primary-medium-s12-lh120 text-[#6B7280] mt-1 px-1 leading-snug">
                    We're planning to conduct tournaments on this also.
                  </p>
                </div>

                <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-gold-primary tracking-wider">
                    We'll update soon
                  </span>
                  <span className="size-1.5 rounded-full bg-gold-primary animate-pulse"></span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
