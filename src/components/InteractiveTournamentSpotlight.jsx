import React, { useState, useEffect } from 'react';

export default function InteractiveTournamentSpotlight({
  tourney,
  onClose,
  onRegister,
  onNavigate,
  isRegistered
}) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  // 3D Parallax Tilt & Specular Glare Tracking
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth tilt up to 10 degrees
    const rotateX = ((centerY - y) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!tourney) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      style={{ perspective: '1200px' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(20px)`,
          transition: 'transform 0.12s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-white/25 bg-[#0D0E12] shadow-[0_30px_90px_rgba(0,0,0,0.95)] text-white group select-none"
      >
        {/* Dynamic Specular Glossy Sheen Overlay tracking mouse pointer */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle 420px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.24), transparent 60%)`,
          }}
        />

        {/* Ambient Glassmorphic Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-gold-primary/20 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-emerald-500/20 blur-3xl"></div>

        {/* High-Resolution Tournament Image Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-neutral-950">
          <img
            src={tourney.image}
            alt={tourney.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Glossy linear gradient mask */}
          <div className="absolute inset-0 bg-linear-to-t from-[#0D0E12] via-[#0D0E12]/50 to-transparent"></div>
          <div className="absolute inset-0 bg-linear-to-r from-[#0D0E12]/80 via-transparent to-[#0D0E12]/80"></div>

          {/* Top-Right Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-40 size-9 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-lg"
          >
            ✕
          </button>

          {/* Top-Left Category & Game Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold-primary text-black shadow-md">
              {tourney.category}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 text-gray-200 border border-white/20 backdrop-blur-md">
              {tourney.game}
            </span>
          </div>

          {/* Prize Pool Floating Badge */}
          <div className="absolute bottom-4 right-4 z-20 bg-black/85 backdrop-blur-md border border-gold-primary/60 rounded-2xl px-4 py-2 text-right shadow-2xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-primary font-bold block">
              Championship Prize Pool
            </span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono drop-shadow-md">
              {tourney.prizePool}
            </span>
          </div>
        </div>

        {/* Single Card Content: Tournament Details & Descriptions */}
        <div className="p-6 sm:p-7 space-y-4 relative z-20">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white drop-shadow-sm">
              {tourney.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-300 font-mono mt-2">
              <span className="flex items-center gap-1.5 text-gold-primary font-bold">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>{tourney.schedule}</span>
              </span>
              <span>&bull;</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {tourney.entryFee || 'FREE ENTRY'}
              </span>
              <span>&bull;</span>
              <span className="text-gray-400 font-bold">{tourney.format || tourney.squadType}</span>
            </div>
          </div>

          {/* Tournament Overview & Rules */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-gray-300 leading-relaxed space-y-2 backdrop-blur-sm">
            <p className="font-medium">
              Join the official arena battle for <strong className="text-white">{tourney.title}</strong>. Compete against top verified esports squads with automated room slot allocations, live spectator coverage, and direct prize distribution.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[11px] font-mono text-gray-400">
              <div>
                <span className="text-gray-500 block">MAP SELECTION:</span>
                <span className="text-white font-bold">{tourney.map || 'Erangel / Miramar'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">SQUAD SLOTS:</span>
                <span className="text-white font-bold">{tourney.slots || 'Open Registration'}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-500 block">ANTI-CHEAT:</span>
                <span className="text-emerald-400 font-bold">Verified Shield ✓</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {isRegistered ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onNavigate) onNavigate('user-dashboard');
                }}
                className="w-full sm:flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <span>Slot Confirmed — View Room Credentials</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onRegister) {
                    onRegister(tourney);
                  } else if (onNavigate) {
                    onNavigate('tournament-register', tourney);
                  }
                }}
                className="w-full sm:flex-1 py-3.5 rounded-xl bg-gold-primary hover:bg-gold-light text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <span>Register Squad for This Match &rarr;</span>
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onNavigate) onNavigate('tournaments');
              }}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border border-white/15 flex items-center justify-center gap-1.5"
            >
              <span>Explore All Tournaments</span>
              <span className="material-symbols-outlined text-[16px]">explore</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
