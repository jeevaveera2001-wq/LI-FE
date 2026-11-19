import React from 'react';

export default function AboutPage({ onNavigate, currentUser }) {
  const isSuperAdmin = currentUser && (currentUser.role === 'superadmin' || currentUser.email === 'superadmin@lt.in');

  return (
    <section className="relative block-default-horizontal-spacing block-default-vertical-spacing w-full">
      <div className="block-default-content-width mx-auto flex flex-col gap-6 md:gap-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-1.5 text-dark-default hover:text-gold-primary primary-bold-s12-lh120 uppercase transition-colors cursor-pointer"
          >
            <span>← Home Arena</span>
          </button>
          <span className="text-[#858585]">&bull;</span>
          <span className="primary-bold-s12-lh120 uppercase tracking-wider text-gold-primary">
            About LiveTournaments.in
          </span>
        </div>

        {/* Hero Section Banner */}
        <div className="rounded-2xl lg:rounded-3xl bg-white p-6 md:p-10 shadow-md border border-[#EBEBEB]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="text-dark-default section-title flex flex-col gap-2 text-left">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/30 text-gold-primary primary-bold-s10-lh130 uppercase tracking-wider">
                  👑 Official Esports Championship Platform
                </span>
                <span className="primary-regular-s12-lh130 text-[#858585]">
                  LiveTournaments.in &bull; Compete. Climb. Conquer.
                </span>
              </div>
              <h1 className="primary-bold-s26-lh110 md:primary-bold-s36-lh100 lg:primary-bold-s42-lh90 uppercase mt-2">
                About LiveTournaments.in
              </h1>
              <p className="primary-regular-s16-lh120 md:primary-regular-s20-lh120 text-[#858585] max-w-3xl leading-relaxed">
                India's next-generation competitive esports hub where <strong className="text-dark-default">everyone can host, register, and play</strong>. We are democratizing esports by providing an automated, fair, and transparent tournament ecosystem for every gamer.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 self-start lg:self-center shrink-0">
              <button
                onClick={() => onNavigate && onNavigate('home')}
                className="px-6 py-3.5 rounded-xl bg-gradient-primary not-disabled:bg-gradient-primary-button text-white primary-bold-s12-lh120 uppercase tracking-wider shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer text-center"
              >
                Browse Tournaments ⚔️
              </button>
              <button
                onClick={() => {
                  if (currentUser) {
                    onNavigate && onNavigate(isSuperAdmin ? 'admin-dashboard' : 'user-dashboard');
                  } else {
                    onNavigate && onNavigate('register');
                  }
                }}
                className="px-6 py-3.5 rounded-xl bg-white-dirty hover:bg-gray-easy border border-[#EBEBEB] text-dark-default primary-bold-s12-lh120 uppercase tracking-wider shadow-xs transition-colors cursor-pointer text-center"
              >
                {currentUser ? 'My Dashboard 👤' : 'Create Free Account 🚀'}
              </button>
            </div>
          </div>

          {/* Quick Platform Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#F0F0F0]">
            <div className="p-4 rounded-2xl bg-white-dirty border border-[#EBEBEB]">
              <div className="primary-bold-s10-lh130 uppercase tracking-wider text-[#858585]">Active Gamers</div>
              <div className="primary-bold-s28-lh100 md:primary-bold-s32-lh100 text-dark-default mt-1">50,000+</div>
              <div className="primary-regular-s10-lh130 text-green-accent mt-1 font-bold">● Nationwide Community</div>
            </div>

            <div className="p-4 rounded-2xl bg-white-dirty border border-[#EBEBEB]">
              <div className="primary-bold-s10-lh130 uppercase tracking-wider text-[#858585]">Tournaments Conducted</div>
              <div className="primary-bold-s28-lh100 md:primary-bold-s32-lh100 text-dark-default mt-1">500+</div>
              <div className="primary-regular-s10-lh130 text-gold-primary mt-1 font-bold">● BGMI, Free Fire, Valorant</div>
            </div>

            <div className="p-4 rounded-2xl bg-white-dirty border border-[#EBEBEB]">
              <div className="primary-bold-s10-lh130 uppercase tracking-wider text-[#858585]">Total Prize Rewards</div>
              <div className="primary-bold-s28-lh100 md:primary-bold-s32-lh100 text-gold-primary mt-1">₹25,00,000+</div>
              <div className="primary-regular-s10-lh130 text-green-accent mt-1 font-bold">● 100% Guaranteed Payouts</div>
            </div>

            <div className="p-4 rounded-2xl bg-white-dirty border border-[#EBEBEB]">
              <div className="primary-bold-s10-lh130 uppercase tracking-wider text-[#858585]">Fair Play Integrity</div>
              <div className="primary-bold-s28-lh100 md:primary-bold-s32-lh100 text-dark-default mt-1">100%</div>
              <div className="primary-regular-s10-lh130 text-green-accent mt-1 font-bold">● Anti-Cheat Verified</div>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars: Host, Register, Play */}
        <div className="space-y-4">
          <div className="text-left">
            <h2 className="primary-bold-s22-lh110 md:primary-bold-s28-lh100 uppercase text-dark-default">
              The Three Pillars of LiveTournaments.in
            </h2>
            <p className="primary-regular-s14-lh120 text-[#858585] mt-1">
              Built specifically to eliminate the barriers of traditional esports tournaments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Everyone Can Host */}
            <div className="rounded-2xl lg:rounded-3xl bg-white p-6 md:p-8 shadow-md border border-[#EBEBEB] flex flex-col justify-between space-y-4 hover:border-gold-primary/50 transition-colors">
              <div className="space-y-3">
                <div className="size-12 rounded-2xl bg-gold-primary/10 flex items-center justify-center text-gold-primary text-2xl shadow-xs">
                  ⚡
                </div>
                <h3 className="primary-bold-s18-lh120 uppercase text-dark-default">
                  1. Everyone Can Host
                </h3>
                <p className="primary-regular-s14-lh120 text-[#858585] leading-relaxed">
                  Whether you are an independent streamer, collegiate gaming society, or a professional clan, you can launch custom tournaments in minutes.
                </p>
                <ul className="space-y-2 primary-regular-s12-lh130 text-dark-default pt-2 border-t border-[#F0F0F0]">
                  <li className="flex items-center gap-2">
                    <span className="text-green-accent font-bold">✓</span>
                    <span>Custom brackets (16, 32, 48, 64 slots)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-accent font-bold">✓</span>
                    <span>Automated participant management & slot tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-accent font-bold">✓</span>
                    <span>Integrated room credential broadcasting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-accent font-bold">✓</span>
                    <span>Flexible prize pool definitions & payouts</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full bg-gold-primary/10 text-gold-primary primary-bold-s10-lh130 uppercase">
                  Creator & Organizer Ready
                </span>
              </div>
            </div>

            {/* Pillar 2: Everyone Can Register */}
            <div className="rounded-2xl lg:rounded-3xl bg-white p-6 md:p-8 shadow-md border border-[#EBEBEB] flex flex-col justify-between space-y-4 hover:border-gold-primary/50 transition-colors">
              <div className="space-y-3">
                <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 text-2xl shadow-xs">
                  📝
                </div>
                <h3 className="primary-bold-s18-lh120 uppercase text-dark-default">
                  2. Everyone Can Register
                </h3>
                <p className="primary-regular-s14-lh120 text-[#858585] leading-relaxed">
                  No gatekeeping, no complicated discord forms, and no delayed manual approvals. Registration takes under 30 seconds with email verification.
                </p>
                <ul className="space-y-2 primary-regular-s12-lh130 text-dark-default pt-2 border-t border-[#F0F0F0]">
                  <li className="flex items-center gap-2">
                    <span className="text-green-accent font-bold">✓</span>
                    <span>Instant single-click slot registration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-accent font-bold">✓</span>
                    <span>Solo or squad roster assembly with teammates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-accent font-bold">✓</span>
                    <span>Automated email confirmations & match reminders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-accent font-bold">✓</span>
                    <span>Strict 6-digit email OTP verification</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 primary-bold-s10-lh130 uppercase">
                  Instant Slot Locking
                </span>
              </div>
            </div>

            {/* Pillar 3: Everyone Can Play */}
            <div className="rounded-2xl lg:rounded-3xl bg-white p-6 md:p-8 shadow-md border border-[#EBEBEB] flex flex-col justify-between space-y-4 hover:border-gold-primary/50 transition-colors">
              <div className="space-y-3">
                <div className="size-12 rounded-2xl bg-green-accent/10 flex items-center justify-center text-green-accent text-2xl shadow-xs">
                  🎮
                </div>
                <h3 className="primary-bold-s18-lh120 uppercase text-dark-default">
                  3. Everyone Can Play & Win
                </h3>
                <p className="primary-regular-s14-lh120 text-[#858585] leading-relaxed">
                  Step onto the competitive battlefield with verified competitors, fair matchmaking, and direct UPI, card & prize pool reward distributions.
                </p>
                <ul className="space-y-2 primary-regular-s12-lh130 text-dark-default pt-2 border-t border-[#F0F0F0]">
                  <li className="flex items-center gap-2">
                    <span className="text-green-accent font-bold">✓</span>
                    <span>Private Room ID & Password emailed 15m before start</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-accent font-bold">✓</span>
                    <span>Live scoreboards, standings & bracket progress</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-accent font-bold">✓</span>
                    <span>Zero tolerance for hacks, emulators or toxic play</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-accent font-bold">✓</span>
                    <span>Instant wallet credits with quick withdrawal</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full bg-green-accent/10 text-green-accent primary-bold-s10-lh130 uppercase">
                  Prize Pool Rewards & Glory
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works (4 Simple Steps) */}
        <div className="rounded-2xl lg:rounded-3xl bg-white p-6 md:p-8 shadow-md border border-[#EBEBEB] space-y-6">
          <div className="text-left">
            <h2 className="primary-bold-s22-lh110 md:primary-bold-s28-lh100 uppercase text-dark-default">
              How LiveTournaments.in Works
            </h2>
            <p className="primary-regular-s14-lh120 text-[#858585] mt-1">
              From signing up to lifting the trophy in four straightforward steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white-dirty border border-[#EBEBEB] space-y-2">
              <div className="primary-bold-s16-lh120 text-gold-primary">STEP 01</div>
              <h4 className="primary-bold-s16-lh120 text-dark-default uppercase">Create Profile</h4>
              <p className="primary-regular-s12-lh130 text-[#858585]">
                Sign up with your gamer tag, mobile number, and email. Complete 6-digit email OTP verification.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white-dirty border border-[#EBEBEB] space-y-2">
              <div className="primary-bold-s16-lh120 text-gold-primary">STEP 02</div>
              <h4 className="primary-bold-s16-lh120 text-dark-default uppercase">Enter or Host</h4>
              <p className="primary-regular-s12-lh130 text-[#858585]">
                Select an open championship tournament for BGMI, Free Fire, or Valorant—or spin up your own bracket.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white-dirty border border-[#EBEBEB] space-y-2">
              <div className="primary-bold-s16-lh120 text-gold-primary">STEP 03</div>
              <h4 className="primary-bold-s16-lh120 text-dark-default uppercase">Get Credentials</h4>
              <p className="primary-regular-s12-lh130 text-[#858585]">
                Custom private room credentials (ID & Password) arrive in your email 15 minutes before match time.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white-dirty border border-[#EBEBEB] space-y-2">
              <div className="primary-bold-s16-lh120 text-gold-primary">STEP 04</div>
              <h4 className="primary-bold-s16-lh120 text-dark-default uppercase">Climb & Win</h4>
              <p className="primary-regular-s12-lh130 text-[#858585]">
                Compete, claim your match victories, climb the rankings, and receive instant prize pool rewards.
              </p>
            </div>
          </div>
        </div>

        {/* Supported Games Section */}
        <div className="rounded-2xl lg:rounded-3xl bg-white p-6 md:p-8 shadow-md border border-[#EBEBEB] space-y-4">
          <div className="text-left">
            <h2 className="primary-bold-s22-lh110 md:primary-bold-s28-lh100 uppercase text-dark-default">
              Supported Esports Titles
            </h2>
            <p className="primary-regular-s14-lh120 text-[#858585] mt-1">
              Official championship brackets across India's top competitive games.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'BGMI', desc: 'Battlegrounds Mobile India', icon: '🎯' },
              { name: 'Free Fire MAX', desc: 'Battle Royale', icon: '🔥' },
              { name: 'Valorant', desc: '5v5 Tactical FPS', icon: '⚔️' },
              { name: 'COD Mobile', desc: 'Multiplayer & BR', icon: '🎖️' },
              { name: 'CS2', desc: 'Counter-Strike 2', icon: '💣' },
              { name: 'Apex Legends', desc: 'Squad Champions', icon: '⚡' },
            ].map(game => (
              <div key={game.name} className="p-4 rounded-xl bg-white-dirty border border-[#EBEBEB] text-center space-y-1 hover:border-gold-primary/50 transition-colors">
                <span className="text-2xl">{game.icon}</span>
                <div className="primary-bold-s14-lh120 text-dark-default uppercase">{game.name}</div>
                <div className="primary-regular-s10-lh130 text-[#858585]">{game.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl lg:rounded-3xl bg-white p-6 md:p-8 shadow-md border border-[#EBEBEB] space-y-3">
            <h3 className="primary-bold-s18-lh120 uppercase text-dark-default flex items-center gap-2">
              <span>🎯</span>
              <span>Our Mission</span>
            </h3>
            <p className="primary-regular-s14-lh120 text-[#858585] leading-relaxed">
              To build a transparent, professional, and accessible esports ecosystem where every aspiring gamer can showcase their talent on equal footing, receive real recognition, and compete for verified prizes.
            </p>
          </div>

          <div className="rounded-2xl lg:rounded-3xl bg-white p-6 md:p-8 shadow-md border border-[#EBEBEB] space-y-3">
            <h3 className="primary-bold-s18-lh120 uppercase text-dark-default flex items-center gap-2">
              <span>🌟</span>
              <span>Our Vision</span>
            </h3>
            <p className="primary-regular-s14-lh120 text-[#858585] leading-relaxed">
              To become India's leading esports infrastructure, bridging the gap between grassroots bedroom competitors and global championship stages through technology, automation, and community empowerment.
            </p>
          </div>
        </div>

        {/* Official Contact & Support Card */}
        <div className="rounded-2xl lg:rounded-3xl bg-white p-6 md:p-8 shadow-md border border-gold-primary/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="primary-bold-s18-lh120 uppercase text-dark-default">
              Get in Touch with LiveTournaments.in
            </h3>
            <p className="primary-regular-s14-lh120 text-[#858585]">
              Questions, partnership inquiries, or tournament support? Our team is available 24/7.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-dark-default">
              <a href="mailto:livetournaments.in@gmail.com" className="flex items-center gap-1.5 text-gold-primary hover:underline">
                <span>✉️</span>
                <span>livetournaments.in@gmail.com</span>
              </a>
              <span className="text-[#858585]">&bull;</span>
              <a href="https://www.instagram.com/livetournaments.in?utm_source=qr&dmpr=bDMyajUxemFudXRm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gold-primary hover:underline">
                <span>📸</span>
                <span>Instagram: @livetournaments.in</span>
              </a>
              <span className="text-[#858585]">&bull;</span>
              <a href="https://www.youtube.com/@livetournament_in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gold-primary hover:underline">
                <span>▶️</span>
                <span>YouTube: @livetournament_in</span>
              </a>
            </div>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="px-6 py-3 rounded-xl bg-gradient-primary not-disabled:bg-gradient-primary-button text-white primary-bold-s12-lh120 uppercase tracking-wider shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            Join Live Tournaments 🏆
          </button>
        </div>
      </div>
    </section>
  );
}
