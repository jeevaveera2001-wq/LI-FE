import React from 'react';

export default function Footer() {
  const instagramUrl = "https://www.instagram.com/livetournaments.in?utm_source=qr&dmpr=bDMyajUxemFudXRm";
  const youtubeUrl = "https://www.youtube.com/@livetournament_in";
  const contactEmail = "livetournaments.in@gmail.com";

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
                    <a href="/en/faqs" className="hover:text-gold-light transition-transform hover:underline hover:translate-x-1">
                      FAQ
                    </a>
                    <a href="/en/rules-and-regulations" className="hover:text-gold-light transition-transform hover:underline hover:translate-x-1">
                      Rules and Regulations
                    </a>
                    <a href="/en/privacy-policy" className="hover:text-gold-light transition-transform hover:underline hover:translate-x-1">
                      LiveTournaments.in Privacy Policy
                    </a>
                    <a href="/en/terms-and-conditions" className="hover:text-gold-light transition-transform hover:underline hover:translate-x-1">
                      LiveTournaments.in Terms &amp; Conditions
                    </a>
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
                    <p className="primary-bold-s12-lh120 text-gold-primary uppercase">choose language</p>
                    <button className="bg-dark-default/90 border border-white/10 hover:border-gold-primary flex items-center justify-between rounded-xl px-5 py-3 hover:bg-gold-primary transition-all duration-200 cursor-pointer min-w-[180px]">
                      <div className="flex items-center gap-3">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-4 text-gold-primary" xmlns="http://www.w3.org/2000/svg">
                          <path fill="none" d="M0 0h24v24H0z"/>
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2m6.93 6h-2.95a15.7 15.7 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8M12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96M4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A8 8 0 0 1 5.08 16m2.95-8H5.08a8 8 0 0 1 4.33-3.56A15.7 15.7 0 0 0 8.03 8M12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96M14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2m.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2z"/>
                        </svg>
                        <span className="primary-bold-s13-lh120 text-white uppercase">English</span>
                      </div>
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-4 text-white/60" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                      </svg>
                    </button>
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

                <div className="primary-bold-s12-lh120 text-gold-primary flex flex-col items-center gap-2.5 uppercase">
                  <a href="/en/faqs" className="hover:text-gold-light transition-transform hover:underline">FAQ</a>
                  <a href="/en/rules-and-regulations" className="hover:text-gold-light transition-transform hover:underline">Rules and Regulations</a>
                  <a href="/en/privacy-policy" className="hover:text-gold-light transition-transform hover:underline">LiveTournaments.in Privacy Policy</a>
                  <a href="/en/terms-and-conditions" className="hover:text-gold-light transition-transform hover:underline">LiveTournaments.in Terms &amp; Conditions</a>
                </div>

                <p className="primary-bold-s12-lh120 text-white/80 uppercase text-center">
                  © 2026 LiveTournaments.in. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
