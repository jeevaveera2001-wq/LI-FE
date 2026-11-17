import React, { useState, useEffect } from 'react';
import { ChevronDown, ExternalLink, Play, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { EmberCanvas } from '../EmberCanvas';

export const HeroSection = ({ onOpenTournamentModal, onJoinNow }) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Smooth mouse parallax motion tracking
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full relative min-h-screen flex items-center justify-center overflow-hidden bg-[#090B0E] selection:bg-[#FFDE00]/30 selection:text-[#FFDE00]"
    >
      {/* 1. Full-Bleed Conqueror Background covering the entire display */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <img
          src="/assets/conqueror_badge.jpg"
          alt="Conqueror Crest Background"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out filter brightness-[0.92] contrast-[1.05]"
          style={{
            transform: `scale(1.05) translate(${mouseOffset.x * -10}px, ${mouseOffset.y * -10}px)`
          }}
        />
      </div>

      {/* 2. Floating Ambient Gold Spark Embers Canvas */}
      <EmberCanvas />

      {/* 3. Cinematic Vignette Gradients for Perfect Emblem & Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090B0E] via-transparent to-black/60 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/85 z-10 pointer-events-none" />

      {/* 4. Centered Main Hero Section with 3D Parallax & Floating Motion */}
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 max-w-4xl mx-auto py-16 transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1000px) rotateY(${mouseOffset.x * 6}deg) rotateX(${-mouseOffset.y * 6}deg) translateZ(10px)`
        }}
      >
        {/* Radiant Pulsing Golden Light Ring behind title */}
        <div className="absolute w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] rounded-full bg-radial from-[#FFDE00]/25 via-[#FFD700]/5 to-transparent blur-3xl pointer-events-none animate-hero-glow -z-10" />

        {/* Top Gold Conqueror Crest Card Badge (Floating) */}
        <div className="animate-float-smooth mb-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 border-[#FFDE00] p-0.5 bg-black/90 shadow-[0_0_25px_rgba(255,222,0,0.55)] backdrop-blur-md hover:scale-110 transition-transform cursor-pointer">
            <img
              src="/assets/conqueror_badge.jpg"
              alt="Emblem Icon"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Giant Main Display Title: LIVE (line 1) TOURNAMENTS.IN (line 2) */}
        <h1 className="font-montserrat font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#FFDE00] tracking-tight uppercase leading-[0.92] drop-shadow-[0_12px_45px_rgba(0,0,0,0.95)] select-none flex flex-col items-center">
          <span>LIVE</span>
          <span>TOURNAMENTS<span className="text-white">.IN</span></span>
        </h1>

        {/* Tagline / Subtitle: PREMIER ESPORTS ARENA */}
        <h2 className="font-montserrat font-black text-xs sm:text-sm md:text-base text-white tracking-[0.35em] uppercase mt-3 sm:mt-4 mb-6 sm:mb-8 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] select-none">
          PREMIER ESPORTS ARENA
        </h2>

        {/* Golden Pill JOIN NOW Button */}
        <div>
          <button
            onClick={() => {
              soundFx.playModalOpen();
              if (onJoinNow) {
                onJoinNow();
              } else {
                onOpenTournamentModal?.();
              }
            }}
            onMouseEnter={() => soundFx.playHover()}
            className="px-9 py-2.5 sm:px-11 sm:py-3 rounded-xl bg-[#FFDE00] hover:bg-[#FFE84D] text-[#090B0E] font-montserrat font-black text-xs sm:text-sm uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_30px_rgba(255,222,0,0.6)] hover:shadow-[0_0_50px_rgba(255,222,0,0.9)] hover:scale-105 active:scale-95 flex items-center justify-center transform"
          >
            JOIN NOW
          </button>
        </div>

      </div>

      {/* 6. Bottom Right Watermark: BATTLEGROUNDS MOBILE INDIA */}
      <div className="absolute bottom-6 right-4 sm:right-8 z-30 text-[10px] sm:text-xs font-montserrat font-black tracking-widest text-[#CBD5E1] bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-[#2B3448] shadow-lg">
        BATTLEGROUNDS MOBILE INDIA
      </div>

      {/* 7. Bottom Center Scroll Down Indicator: EXPLORE ARENA */}
      <a
        href="#trophies"
        onClick={() => soundFx.playClick()}
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex-col items-center text-[#788294] hover:text-[#FFDE00] transition-colors cursor-pointer group"
      >
        <span className="text-[10px] font-montserrat font-bold tracking-widest uppercase mb-1 group-hover:tracking-[0.2em] transition-all">
          EXPLORE ARENA
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#FFDE00]" />
      </a>

    </section>
  );
};

export default HeroSection;