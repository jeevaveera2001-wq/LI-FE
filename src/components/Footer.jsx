import React, { useState } from 'react';

export default function Footer() {
  const instagramUrl = "https://www.instagram.com/livetournaments.in?utm_source=qr&dmpr=bDMyajUxemFudXRm";
  const youtubeUrl = "https://www.youtube.com/@livetournament_in";
  const contactEmail = "livetournaments.in@gmail.com";

  // Legal & Information Modal State ('faq' | 'rules' | 'privacy' | 'terms' | null)
  const [activeModal, setActiveModal] = useState(null);

  const openLegalModal = (type, e) => {
    if (e) e.preventDefault();
    setActiveModal(type);
  };

  const closeLegalModal = () => {
    setActiveModal(null);
  };

  return (
    <footer className="mt-auto lg:ps-sidebar-width select-none">
      <div className="flex flex-col pb-18 lg:pb-0 webview-hide">
        {/* Top Gold Gradient Bar */}
        <div className="bg-gradient-primary h-3"></div>

        <div className="bg-dark-default relative overflow-hidden">
          {/* Background image & gradient overlay */}
          <img
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover pointer-events-none opacity-40"
            src="https://d3h9qea4qy4169.cloudfront.net/abstract_background_ef90392883.png"
          />
          <div className="to-dark-default absolute inset-0 size-full bg-linear-to-r from-transparent via-black/40 to-black/90 pointer-events-none"></div>

          <div className="relative mx-auto max-w-6xl px-4 py-10 lg:pt-[90px] lg:pb-16 xl:px-8">
            {/* Desktop View (lg and above) */}
            <div className="hidden lg:contents">
              <div className="flex justify-between gap-8">
                {/* Left Column: Navigation & Contact & Copyright */}
                <div className="flex flex-col justify-between gap-10">
                  {/* Legal & Information Links */}
                  <div className="primary-bold-s12-lh120 text-gold-primary flex flex-col items-start gap-2.5 uppercase">
                    <button
                      onClick={(e) => openLegalModal('faq', e)}
                      className="hover:text-gold-light transition-transform hover:underline hover:translate-x-1 cursor-pointer text-left"
                    >
                      FAQ
                    </button>
                    <button
                      onClick={(e) => openLegalModal('rules', e)}
                      className="hover:text-gold-light transition-transform hover:underline hover:translate-x-1 cursor-pointer text-left"
                    >
                      Rules and Regulations
                    </button>
                    <button
                      onClick={(e) => openLegalModal('privacy', e)}
                      className="hover:text-gold-light transition-transform hover:underline hover:translate-x-1 cursor-pointer text-left"
                    >
                      LiveTournaments.in Privacy Policy
                    </button>
                    <button
                      onClick={(e) => openLegalModal('terms', e)}
                      className="hover:text-gold-light transition-transform hover:underline hover:translate-x-1 cursor-pointer text-left"
                    >
                      LiveTournaments.in Terms &amp; Conditions
                    </button>
                  </div>

                  {/* Official Social Media & Contact Email */}
                  <div className="flex flex-col gap-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                      Connect &amp; Support
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Instagram */}
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-gradient-primary border border-white/10 hover:border-gold-primary text-white hover:text-white transition-all duration-200 group shadow-sm"
                        title="Follow LiveTournaments on Instagram"
                      >
                        <svg className="size-4 text-gold-primary group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span className="text-xs font-bold uppercase tracking-wider">Instagram</span>
                      </a>

                      {/* YouTube */}
                      <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-gradient-primary border border-white/10 hover:border-gold-primary text-white hover:text-white transition-all duration-200 group shadow-sm"
                        title="Subscribe to LiveTournaments on YouTube"
                      >
                        <svg className="size-4 text-gold-primary group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span className="text-xs font-bold uppercase tracking-wider">YouTube</span>
                      </a>

                      {/* Official Email */}
                      <a
                        href={`mailto:${contactEmail}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-gradient-primary border border-white/10 hover:border-gold-primary text-white hover:text-white transition-all duration-200 group shadow-sm"
                        title="Send inquiry to official support"
                      >
                        <svg className="size-4 text-gold-primary group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                          <path fill="none" d="M0 0h24v24H0z"/>
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        <span className="text-xs font-bold lowercase tracking-normal">{contactEmail}</span>
                      </a>
                    </div>
                  </div>

                  <p className="primary-bold-s12-lh120 text-white/80 uppercase">
                    © 2026 LiveTournaments.in. All rights reserved.
                  </p>
                </div>

                {/* Right Column: Custom Wordmark & Language Selector */}
                <div className="flex w-full max-w-[480px] flex-col items-end justify-between gap-10">
                  <img
                    alt="LiveTournaments.in logo"
                    loading="lazy"
                    width="567"
                    height="91"
                    decoding="async"
                    className="h-[78px] w-auto xl:h-[91px] xl:w-auto max-w-[567px] object-contain select-none"
                    src="/assets/lt_wordmark_custom.png"
                  />

                  <div className="flex w-full min-w-[196px] flex-col items-end gap-2.5">
                    <p className="primary-bold-s12-lh120 text-gold-primary uppercase">Official Platform Language</p>
                    <div className="bg-dark-default/90 border border-white/10 flex items-center justify-between rounded-xl px-5 py-3 min-w-[180px]">
                      <div className="flex items-center gap-3">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-4 text-gold-primary" xmlns="http://www.w3.org/2000/svg">
                          <path fill="none" d="M0 0h24v24H0z"/>
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2m6.93 6h-2.95a15.7 15.7 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8M12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96M4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A8 8 0 0 1 5.08 16m2.95-8H5.08a8 8 0 0 1 4.33-3.56A15.7 15.7 0 0 0 8.03 8M12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96M14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2m.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2z"/>
                        </svg>
                        <span className="primary-bold-s13-lh120 text-white uppercase">English (India)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile View (max-lg) */}
            <div className="hidden max-lg:contents">
              <div className="flex flex-col items-center gap-8">
                <img
                  alt="LiveTournaments.in logo"
                  loading="lazy"
                  width="540"
                  height="87"
                  decoding="async"
                  className="h-[54px] w-auto max-w-full object-contain select-none"
                  src="/assets/lt_wordmark_custom.png"
                />

                {/* Social Media & Contact Links (Mobile Centered) */}
                <div className="flex flex-col items-center gap-3 w-full max-w-sm">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                    Connect &amp; Support
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
                    {/* Instagram */}
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-gradient-primary border border-white/10 text-white text-xs font-bold uppercase tracking-wider"
                    >
                      <svg className="size-4 text-gold-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span>Instagram</span>
                    </a>

                    {/* YouTube */}
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-gradient-primary border border-white/10 text-white text-xs font-bold uppercase tracking-wider"
                    >
                      <svg className="size-4 text-gold-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <span>YouTube</span>
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-gradient-primary border border-white/10 text-white text-xs font-medium lowercase tracking-normal"
                    >
                      <svg className="size-4 text-gold-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      <span>{contactEmail}</span>
                    </a>
                  </div>
                </div>

                <div className="primary-bold-s12-lh120 text-gold-primary flex flex-col items-center gap-2.5 uppercase text-center">
                  <button onClick={(e) => openLegalModal('faq', e)} className="hover:text-gold-light transition-transform hover:underline cursor-pointer">
                    FAQ
                  </button>
                  <button onClick={(e) => openLegalModal('rules', e)} className="hover:text-gold-light transition-transform hover:underline cursor-pointer">
                    Rules and Regulations
                  </button>
                  <button onClick={(e) => openLegalModal('privacy', e)} className="hover:text-gold-light transition-transform hover:underline cursor-pointer">
                    LiveTournaments.in Privacy Policy
                  </button>
                  <button onClick={(e) => openLegalModal('terms', e)} className="hover:text-gold-light transition-transform hover:underline cursor-pointer">
                    LiveTournaments.in Terms &amp; Conditions
                  </button>
                </div>

                <p className="primary-bold-s12-lh120 text-white/80 uppercase text-center">
                  © 2026 LiveTournaments.in. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          OFFICIAL LEGAL & INFORMATION MODAL
          ======================================================== */}
      {activeModal && (
        <div 
          onClick={closeLegalModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[88vh]"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 bg-neutral-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gold-primary/20 text-gold-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">
                    {activeModal === 'faq' ? 'help_outline' : activeModal === 'rules' ? 'gavel' : activeModal === 'privacy' ? 'security' : 'verified'}
                  </span>
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-gold-primary text-black">
                    Official Documentation
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    {activeModal === 'faq' && 'Frequently Asked Questions (FAQ)'}
                    {activeModal === 'rules' && 'Official Tournament Rules & Regulations'}
                    {activeModal === 'privacy' && 'LiveTournaments.in Privacy Policy'}
                    {activeModal === 'terms' && 'LiveTournaments.in Terms & Conditions'}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={closeLegalModal}
                className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Quick Nav Tabs */}
            <div className="px-4 py-2.5 bg-neutral-100 border-b border-gray-200 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setActiveModal('faq')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeModal === 'faq' ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveModal('rules')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeModal === 'rules' ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                Rules &amp; Regulations
              </button>
              <button
                onClick={() => setActiveModal('privacy')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeModal === 'privacy' ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveModal('terms')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeModal === 'terms' ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                Terms &amp; Conditions
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs text-gray-700 leading-relaxed">
              
              {/* VIEW 1: FAQ */}
              {activeModal === 'faq' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-neutral-900">
                    <p className="font-bold text-sm">Need Fast Support?</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Contact our 24/7 Match Operations Desk at <strong className="text-black">{contactEmail}</strong> or ping us on Instagram <strong className="text-black">@livetournaments.in</strong>.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl p-4 space-y-1.5">
                      <h4 className="font-bold text-sm text-gray-900">1. What is LiveTournaments.in?</h4>
                      <p>
                        LiveTournaments.in is India's official digital platform for competitive esports matchmaking. We organize daily practice scrims, verified custom room showdowns, and national tournaments across Battlegrounds Mobile India (BGMI), PUBG Mobile, and Free Fire MAX.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 space-y-1.5">
                      <h4 className="font-bold text-sm text-gray-900">2. How do I register for a tournament match?</h4>
                      <p>
                        Navigate to the Tournament Match Arena, sign in with your player account, choose an open match, and submit your Squad / Clan Name, In-Game Name (IGN), Character ID, and WhatsApp contact. Your registration slot is confirmed immediately on your dashboard.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 space-y-1.5">
                      <h4 className="font-bold text-sm text-gray-900">3. When and how do I receive Custom Room credentials?</h4>
                      <p>
                        Room ID and Password are automatically published exactly <strong>15 minutes prior to match schedule</strong> inside your Competitor Dashboard and dispatched to the squad leader's verified WhatsApp number.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 space-y-1.5">
                      <h4 className="font-bold text-sm text-gray-900">4. Are tournaments free to enter?</h4>
                      <p>
                        All official flagship tournaments hosted by LiveTournaments.in offer <strong>100% Free Entry</strong> with guaranteed cash prize pools. Community organizers and partners can also host private entry scrims with transparent prize escrows.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 space-y-1.5">
                      <h4 className="font-bold text-sm text-gray-900">5. How are prize payouts processed?</h4>
                      <p>
                        All tournament payouts are <strong>100% Digital via Indian UPI (VPA)</strong>. We have a strict zero-cash policy. Prize winnings are credited directly to your connected digital wallet and can be withdrawn to your UPI ID without hidden processing fees.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 space-y-1.5">
                      <h4 className="font-bold text-sm text-gray-900">6. What happens if a player cheats or uses emulators?</h4>
                      <p>
                        Our anti-cheat team monitors every lobby in real-time. Use of emulators, iPads (unless designated), third-party recoil scripts, or teaming results in immediate disqualification, forfeiture of prizes, and permanent hardware and account blacklisting.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: RULES AND REGULATIONS */}
              {activeModal === 'rules' && (
                <div className="space-y-5">
                  <div className="border-l-4 border-gold-primary pl-4 py-1">
                    <h4 className="text-sm font-black text-gray-900 uppercase">LiveTournaments Official Esports Rulebook</h4>
                    <p className="text-[11px] text-gray-500">Version 3.4 • Updated November 2026 • Applicable to all official lobbies</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1.5">
                      <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Rule 1: Squad Eligibility &amp; Roster Stability</h5>
                      <p>
                        • All competitors must have an in-game level of 30 or higher and a valid character ID.<br />
                        • Roster changes within 1 hour of match start are strictly prohibited.<br />
                        • Squad leaders are responsible for ensuring all four teammates join the assigned slot number in the custom lobby.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1.5">
                      <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Rule 2: Lobby Schedule &amp; Slot Protocol</h5>
                      <p>
                        • Custom Room opens 15 minutes before match start.<br />
                        • Matches will start promptly at the advertised time. No match will be delayed for offline players.<br />
                        • Players joining wrong slot numbers will be kicked by the room referee without warning.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1.5">
                      <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Rule 3: Official Scoring Matrix (BGIS / PMSL Standard)</h5>
                      <p>
                        • 1st Place (WWCD): 10 Points<br />
                        • 2nd Place: 6 Points | 3rd Place: 5 Points | 4th Place: 4 Points<br />
                        • 5th Place: 3 Points | 6th Place: 2 Points | 7th-8th Place: 1 Point<br />
                        • Each Kill: 1 Point. Tiebreakers are decided by Total WWCDs followed by Total Kill Points.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1.5">
                      <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Rule 4: Anti-Cheat &amp; Prohibited Equipment</h5>
                      <p>
                        • Handheld smartphones only. Emulators, tablet triggers, and third-party macro devices are banned.<br />
                        • Any player caught using speed hacks, wallhacks, auto-aim, or texture edits faces a permanent ban from LiveTournaments.in and will be reported to game publishers.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1.5">
                      <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Rule 5: Match Disputes &amp; Proof Submission</h5>
                      <p>
                        • Clan leaders must submit match screenshots and screen recording proof within 30 minutes of match completion to the referee desk. Unrecorded disputes cannot be investigated.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 3: PRIVACY POLICY */}
              {activeModal === 'privacy' && (
                <div className="space-y-5">
                  <div className="border-l-4 border-emerald-500 pl-4 py-1">
                    <h4 className="text-sm font-black text-gray-900 uppercase">LiveTournaments.in Privacy &amp; Data Security Policy</h4>
                    <p className="text-[11px] text-gray-500">Committed to Player Privacy, Zero Cookie Exploitation &amp; Transparent Telemetry</p>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-gray-200 p-4 rounded-xl space-y-1.5">
                      <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">1. Zero Sensitive Cookie Guarantee</h5>
                      <p>
                        We do NOT store sensitive personal data, unhashed passwords, credit/debit card numbers, or plain credentials inside browser cookies. All authentication tokens are handled securely via isolated sessions and state-of-the-art encryption protocols.
                      </p>
                    </div>

                    <div className="border border-gray-200 p-4 rounded-xl space-y-1.5">
                      <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">2. High-Precision Geolocation &amp; Telemetry Data</h5>
                      <p>
                        To ensure regional tournament bracket fairness, prevent cross-border proxy fraud, and comply with state skill-gaming jurisdictions, we capture device GPS and network IP coordinates with explicit user consent. This data is strictly used for platform audit logs and is never sold to third-party ad brokers.
                      </p>
                    </div>

                    <div className="border border-gray-200 p-4 rounded-xl space-y-1.5">
                      <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">3. Information We Collect</h5>
                      <p>
                        We collect: (a) Player Account Info: Username, mobile number, email; (b) Gaming Profile: In-game name (IGN), character ID, clan affiliation; (c) Digital Financials: Linked UPI VPA for prize payouts; (d) Match Logs: Kill counts, rankings, custom room activity.
                      </p>
                    </div>

                    <div className="border border-gray-200 p-4 rounded-xl space-y-1.5">
                      <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">4. Cryptographic Security Standards</h5>
                      <p>
                        All passwords are salted and hashed using industry-standard SHA-256 algorithms. Financial communications are encrypted with TLS 1.3 to guarantee that no unauthorized party can access your telemetry or prize balances.
                      </p>
                    </div>

                    <div className="border border-gray-200 p-4 rounded-xl space-y-1.5">
                      <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">5. Player Rights &amp; Data Erasure</h5>
                      <p>
                        You have the right to inspect your logged activity telemetry or request complete account deletion at any time by emailing our Data Protection Officer at <strong className="text-black">{contactEmail}</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 4: TERMS AND CONDITIONS */}
              {activeModal === 'terms' && (
                <div className="space-y-5">
                  <div className="border-l-4 border-gold-primary pl-4 py-1">
                    <h4 className="text-sm font-black text-gray-900 uppercase">LiveTournaments.in Platform Terms &amp; Conditions</h4>
                    <p className="text-[11px] text-gray-500">Governing Competitive Esports Participation &amp; Digital Prize Payouts</p>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-gray-200 p-4 rounded-xl space-y-1.5">
                      <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">1. Legality of Skill Gaming in India</h5>
                      <p>
                        Competitions organized on LiveTournaments.in are pure <strong>Games of Skill</strong>. The outcome of each match depends predominantly on strategic skill, marksmanship, decision making, and teamwork. Under Section 12 of the Public Gambling Act, 1867, games of skill are excluded from the scope of gambling laws in India.
                      </p>
                    </div>

                    <div className="border border-gray-200 p-4 rounded-xl space-y-1.5">
                      <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">2. Age &amp; Geographic Eligibility</h5>
                      <p>
                        Participation in tournaments offering cash prizes is strictly restricted to Indian citizens aged <strong>18 years or older</strong>. Players residing in states where skill-gaming prize distributions are restricted by local statutes (including Assam, Odisha, Telangana, Nagaland, Andhra Pradesh, and Sikkim) may only participate in practice matches without prize claims.
                      </p>
                    </div>

                    <div className="border border-gray-200 p-4 rounded-xl space-y-1.5">
                      <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">3. Strict Zero Cash Policy &amp; Digital Payouts</h5>
                      <p>
                        LiveTournaments.in operates exclusively via authorized digital banking and UPI channels. Physical currency transactions are strictly forbidden. All prize amounts are verified by audit records and deposited into digital wallets for direct UPI withdrawal.
                      </p>
                    </div>

                    <div className="border border-gray-200 p-4 rounded-xl space-y-1.5">
                      <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">4. Code of Conduct &amp; Fair Play</h5>
                      <p>
                        Competitors agree to maintain professional sportsmanship. Hate speech, harassment of opponents, clan match-fixing, toxicity on stream chats, or defamation of referees will result in immediate disqualification and account termination.
                      </p>
                    </div>

                    <div className="border border-gray-200 p-4 rounded-xl space-y-1.5">
                      <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">5. Publisher Trademark Acknowledgment</h5>
                      <p>
                        Battlegrounds Mobile India (BGMI) is a registered trademark of Krafton Inc. Free Fire MAX is a trademark of Garena. LiveTournaments.in is an independent platform and operates in full compliance with relevant community tournament licensing guidelines.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-gray-500 font-mono">
                LiveTournaments.in Official Legal Framework &bull; 2026
              </span>
              <button
                type="button"
                onClick={closeLegalModal}
                className="px-5 py-2 rounded-xl bg-black hover:bg-gold-primary hover:text-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
