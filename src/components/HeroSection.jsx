import React, { useState, useEffect, useRef } from 'react';

export default function HeroSection({ onNavigate }) {
  const videoRef = useRef(null);
  const [platformSettings, setPlatformSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('lt_platform_settings');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('lt_platform_settings');
        if (saved) setPlatformSettings(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('lt_platform_settings_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('lt_platform_settings_updated', handleSync);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Browser autoplay policy requires DOM properties to be explicitly set
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;

    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented by browser, listening for user interaction:', err);
          const startPlayback = () => {
            video.play().catch(() => {});
            ['click', 'touchstart', 'scroll', 'keydown'].forEach((evt) => {
              window.removeEventListener(evt, startPlayback);
            });
          };
          ['click', 'touchstart', 'scroll', 'keydown'].forEach((evt) => {
            window.addEventListener(evt, startPlayback, { passive: true, once: true });
          });
        });
      }
    };

    playVideo();
  }, []);

  const handleScrollDown = () => {
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
  };

  const handleRegisterClick = () => {
    if (onNavigate) {
      onNavigate('register');
    }
  };

  return (
    <section className="relative z-10 overflow-hidden min-h-screen flex flex-col justify-between">
      <div className="absolute start-0 top-0 -z-10 size-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          style={{
            filter: 'hue-rotate(175deg) saturate(1.35) brightness(1.08) contrast(1.18)',
          }}
          className="size-full object-cover transition-all duration-700"
        >
          <source src="/assets/hero_video.mp4" type="video/mp4" />
          <source src="https://d3h9qea4qy4169.cloudfront.net/ewc_2026_homepage_hero_video_9e7d137767.mp4" type="video/mp4" />
          Your browser does not support HTML video.
        </video>

        {/* Luminous Glacier Atmospheric Effects */}
        <div className="absolute inset-0 bg-radial from-transparent via-cyan-950/20 to-black/60 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-cyan-400/12 blur-[140px] rounded-full pointer-events-none" />
      </div>

      <div className="px-4 pt-[160px] pb-[40px] lg:px-8 lg:pt-[140px] xl:pt-[160px] 2xl:pt-[200px] flex-1 flex flex-col items-center justify-center">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center text-center gap-5 md:gap-6">
          
          {/* Register Now Button - Click to navigate to Register Page */}
          <div 
            onClick={handleRegisterClick}
            className="bg-gradient-primary rounded-[9px] px-4 py-1.5 cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_20px_rgba(168,137,78,0.4)] animate-pulse"
            role="button"
            tabIndex={0}
          >
            <p className="primary-bold-s14-lh120 md:primary-bold-s16-lh120 text-white uppercase tracking-wider">Register Now</p>
          </div>

          <div className="my-2 flex items-center justify-center select-none relative">
            <div className="absolute -inset-x-20 -inset-y-10 bg-radial from-black/85 via-black/40 to-transparent blur-xl pointer-events-none rounded-full -z-10"></div>
            <img alt="LiveTournaments.in Logo" className="aspect-[5] w-[630px] xl:w-[834px] 2xl:w-[1024px] pointer-events-none drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)] relative z-10" src="/assets/lt_wordmark_custom.png"/>
          </div>

          <div className="mx-auto w-full max-w-[850px] text-center flex items-center justify-center">
            <p className="primary-bold-s14-lh120 md:primary-bold-s21-lh120 text-white uppercase text-center">
              {platformSettings?.tagline || 'Join us from now to participate and host your tournaments via LT.IN.'}
            </p>
          </div>

          {/* Bouncing Scroll Indicator */}
          <div className="mt-6 flex items-center justify-center">
            <div 
              onClick={handleScrollDown}
              className="mx-auto w-fit rounded-[18px] bg-white/15 hover:bg-white/25 p-1.5 ps-[25px] backdrop-blur-[32px] cursor-pointer transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] border border-white/10 group"
            >
              <div className="flex items-center gap-3.5">
                <p className="primary-bold-s12-lh120 text-white uppercase tracking-wider group-hover:text-gold-light transition-colors">scroll for more info</p>
                <div className="flex size-[42px] items-center justify-center overflow-hidden rounded-full bg-white/10 group-hover:bg-gold-primary/30 transition-colors">
                  <div className="flex flex-col items-center gap-1 animate-bounce">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-5 text-white" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
