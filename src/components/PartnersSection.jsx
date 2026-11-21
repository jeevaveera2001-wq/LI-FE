import React from 'react';

export default function PartnersSection({ onNavigate }) {
  const handlePartnerClick = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('partners');
    }
  };

  return (
    <section className="relative block-default-horizontal-spacing block-default-vertical-spacing">
      <div className="block-default-content-width mx-auto">
        <div className="relative flex flex-col gap-5 md:gap-8">
          <div className="flex items-end justify-between gap-8">
            <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-center">
              <div className="text-dark-default section-title flex w-full flex-col gap-1 normal-case text-left">
                <h2 className="primary-bold-s26-lh110 md:primary-bold-s32-lh100 lg:primary-bold-s38-lh100 xl:primary-bold-s42-lh90">
                  Partners &amp; Sponsors
                </h2>
                <p className="primary-regular-s14-lh120 md:primary-regular-s18-lh120 lg:primary-regular-s20-lh120 text-[#858585]">
                  We're looking for global brand sponsors, clan partners, and gaming equipment makers to collaborate with LiveTournaments.in for upcoming championship seasons.
                </p>
              </div>
            </div>
            <div className="hidden lg:contents">
              <button
                onClick={handlePartnerClick}
                className="inline-flex h-fit items-center justify-center transition-all not-disabled:cursor-pointer px-6 py-3 rounded-lg lg:rounded-[14px] bg-gradient-primary text-white primary-bold-s12-lh120 lg:primary-bold-s13-lh120 uppercase whitespace-nowrap shadow-sm hover:opacity-95 hover:scale-105"
              >
                <span>Partner With Us</span>
              </button>
            </div>
          </div>

          <div className="my-4 flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm border border-[#EBEBEB] max-md:flex-col max-md:text-center gap-5">
            <div className="flex flex-col gap-1">
              <p className="primary-bold-s16-lh120 text-dark-default uppercase">
                Official Partnership &amp; Direct Sponsorship Portal
              </p>
              <p className="primary-regular-s14-lh120 text-[#6B6B6B] max-w-2xl">
                Interested in sponsoring or partnering with official LiveTournaments.in events and broadcast seasons? Submit your official proposal directly to our Super Admin command team on the dedicated partnership page.
              </p>
            </div>
            <button
              onClick={handlePartnerClick}
              className="inline-flex items-center justify-center shrink-0 px-6 py-3 rounded-xl bg-dark-default text-white primary-bold-s12-lh120 uppercase hover:bg-gold-primary hover:text-black transition-all cursor-pointer shadow-md"
            >
              Open Partnership Page
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
