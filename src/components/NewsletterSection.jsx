import React from 'react';

export default function NewsletterSection() {
  const youtubeUrl = "https://www.youtube.com/@livetournament_in";

  return (
    <section className="relative block-default-horizontal-spacing block-default-vertical-spacing">
      <div className="block-default-content-width mx-auto">
        <div className="relative flex flex-col gap-5 md:gap-8">
          <div className="flex flex-col gap-8">
            <div className="subscribe-banner-flex gap-4 rounded-lg bg-white p-4 shadow-md md:gap-6 md:rounded-3xl md:p-8">
              <div className="text-dark-default flex grow flex-col gap-1">
                <p className="primary-bold-s21-lh120 xl:primary-bold-s24-lh110">DON&#x27;T MISS A THING!</p>
                <p className="primary-regular-s16-lh120 text-[#6B7280]">
                  Get our latest updates directly to your inbox, along with special offers and rewards.
                </p>
              </div>
              <div className="shrink-0 md:w-fit">
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-fit items-center justify-center transition-all not-disabled:cursor-pointer disabled:pointer-events-none disabled:focus-visible:outline-0 w-full disabled:bg-dark-default/15 disabled:text-white not-disabled:bg-gradient-primary-button not-disabled:hover:bg-gradient-primary-hover-button text-white primary-bold-s12-lh120 lg:primary-bold-s13-lh120 uppercase px-[35.75px] lg:px-9 py-4 lg:py-[18px] rounded-lg lg:rounded-[14px] hover:shadow-lg hover:brightness-110 cursor-pointer"
                >
                  <span className="relative inline-flex items-center justify-center gap-2">
                    <svg className="size-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span className="inline-flex align-middle">SUBSCRIBE NOW</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="hidden max-lg:contents"></div>
        </div>
      </div>
    </section>
  );
}
