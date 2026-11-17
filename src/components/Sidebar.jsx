import React from 'react';
import { Home, Trophy, Swords, MessageSquare, BarChart2, Mail, Shield, Crown, Vote, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const Sidebar = ({
  activeSection,
  onSelectSection,
  currentUser,
  onOpenSuperAdmin,
  onOpenAdmin,
  onOpenLogin
}) => {
  const navItems = [
    { id: 'hero', icon: Home, label: 'Hero Overview' },
    { id: 'trophies', icon: Trophy, label: 'Featured Tournaments' },
    { id: 'tournaments', icon: Swords, label: 'Tournaments' },
    { id: 'winners', icon: Shield, label: 'Winners & Hall of Fame' },
    { id: 'poll', icon: Vote, label: 'Live Fan Poll' },
    { id: 'sponsors', icon: Sparkles, label: 'Sponsors & Supporters' },
    { id: 'contact', icon: Mail, label: 'Contact & Enquiries' },
  ];

  return (
    <aside className="hidden lg:flex flex-col items-center justify-between w-14 py-3 bg-[#090B0E] border-r border-[#1B212D] fixed left-0 top-0 bottom-0 z-40 overflow-y-auto no-scrollbar">
      
      {/* Top Brand Crest & Navigation Strip */}
      <div className="flex flex-col items-center gap-3.5 w-full">
        <a
          href="#hero"
          onClick={() => soundFx.playClick()}
          className="w-8 h-8 rounded-lg overflow-hidden border border-[#E5C05B]/60 p-0.5 bg-[#11141B] flex items-center justify-center shadow-[0_0_10px_rgba(229,192,91,0.25)] hover:scale-105 transition-transform"
        >
          <img
            src="/assets/conqueror_badge.jpg"
            alt="Crest"
            className="w-full h-full object-cover rounded"
          />
        </a>

        {/* Navigation Icons Strip */}
        <nav className="flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeSection;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                title={item.label}
                onClick={() => {
                  soundFx.playClick();
                  onSelectSection?.(item.id);
                }}
                onMouseEnter={() => soundFx.playHover()}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  active
                    ? 'text-[#E5C05B] bg-[#E5C05B]/15 border border-[#E5C05B]/50 shadow-[0_0_10px_rgba(229,192,91,0.25)]'
                    : 'text-[#64748B] hover:text-[#E2E8F0] hover:bg-[#141822]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile / Admin Status Badge */}
      <div className="flex flex-col items-center gap-2 pt-3 border-t border-[#1B212D] w-full">
        {currentUser ? (
          currentUser.role === 'SUPER_ADMIN' ? (
            <button
              onClick={() => {
                soundFx.playVictory();
                onOpenSuperAdmin?.();
              }}
              title="Super Admin: Last Zetas (Click to open Console)"
              className="w-7 h-7 rounded-md bg-white border border-[#333] flex items-center justify-center text-black text-[9px] font-black font-mono mt-1 cursor-pointer hover:scale-110 transition-transform shadow-md"
            >
              SA
            </button>
          ) : (
            <button
              onClick={() => {
                soundFx.playVictory();
                onOpenAdmin?.();
              }}
              title="Match Ops Admin: Admin (Click to open Desk)"
              className="w-7 h-7 rounded-md bg-[#1C1C1C] border border-[#333] flex items-center justify-center text-white text-[9px] font-bold font-mono mt-1 cursor-pointer hover:scale-110 transition-transform"
            >
              AD
            </button>
          )
        ) : (
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenLogin?.();
            }}
            title="Portal Login"
            className="w-6 h-6 rounded-md bg-[#141822] border border-[#222938] hover:border-[#E5C05B]/60 flex items-center justify-center text-[#E5C05B] text-[9px] font-bold font-mono mt-1 cursor-pointer transition-colors"
          >
            MK
          </button>
        )}
      </div>

    </aside>
  );
};