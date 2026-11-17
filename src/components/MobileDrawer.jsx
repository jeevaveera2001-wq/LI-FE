import React from 'react';
import {
  X, Home, Trophy, Swords, MessageSquare, BarChart2, Mail,
  Shield, Crown, Key, LogOut, ArrowRight, ExternalLink, Calendar, Sparkles
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export const MobileDrawer = ({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
  currentUser,
  onOpenLogin,
  onOpenSuperAdmin,
  onOpenAdmin,
  onLogout
}) => {
  if (!isOpen) return null;

  const navLinks = [
    { id: 'hero', icon: Home, label: 'Hero Overview', badge: 'Live' },
    { id: 'trophies', icon: Trophy, label: 'Featured Tournaments' },
    { id: 'tournaments', icon: Swords, label: 'Live Tournaments', badge: 'Active' },
    { id: 'winners', icon: Shield, label: 'Scrims & Standings', highlight: 'Top 10' },
    { id: 'upcoming', icon: Calendar, label: 'Upcoming Tournaments', badge: 'Next' },
    { id: 'sponsors', icon: Sparkles, label: 'Sponsors & Supporters' },
    { id: 'contact', icon: Mail, label: 'Contact & Official Enquiries' },
  ];

  const handleNavClick = (sectionId) => {
    soundFx.playClick();
    onSelectSection?.(sectionId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        onClick={() => {
          soundFx.playClick();
          onClose();
        }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-[85%] max-w-xs bg-[#090C12] border-r border-[#1E2536] text-[#E2E8F0] h-full flex flex-col justify-between shadow-2xl z-10 overflow-y-auto font-sans">
        
        {/* Top Header */}
        <div>
          <div className="p-4 border-b border-[#1E2536] flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#E5C05B]/60 p-0.5 bg-[#11141B]">
                <img
                  src="/assets/conqueror_badge.jpg"
                  alt="Crest"
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-montserrat font-black text-sm text-white tracking-wider uppercase">
                  LIVE TOURNAMENTS<span className="text-[#E5C05B]">.IN</span>
                </span>
                <span className="font-rajdhani text-[10px] tracking-widest text-[#E5C05B] font-bold uppercase -mt-0.5">
                  ESPORTS ARENA
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-[#141822] text-[#788294] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Auth Quick Card */}
          <div className="p-3 mx-3 mt-3 rounded-xl bg-[#0F131C] border border-[#1E2536]">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-[#FFD700]" />
                    <span className="font-montserrat font-bold text-xs text-white uppercase">
                      {currentUser.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : 'MATCH OPS ADMIN'}
                    </span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white text-black font-mono font-bold">
                    JWT ACTIVE
                  </span>
                </div>
                <p className="text-[10px] text-[#94A3B8] font-mono truncate">
                  @{currentUser.username || currentUser.name || (currentUser.role === 'SUPER_ADMIN' ? 'lastzetas' : 'admin')}
                </p>

                <div className="flex items-center gap-1.5 pt-1">
                  {currentUser.role === 'SUPER_ADMIN' ? (
                    <button
                      onClick={() => {
                        soundFx.playVictory();
                        onOpenSuperAdmin?.();
                        onClose();
                      }}
                      className="flex-1 py-1.5 rounded bg-white hover:bg-[#E5E5E5] text-black font-mono font-bold text-[10px] uppercase text-center cursor-pointer transition-colors"
                    >
                      Super Admin Console
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundFx.playVictory();
                        onOpenAdmin?.();
                        onClose();
                      }}
                      className="flex-1 py-1.5 rounded bg-white hover:bg-[#E5E5E5] text-black font-mono font-bold text-[10px] uppercase text-center cursor-pointer transition-colors"
                    >
                      Match Ops Desk
                    </button>
                  )}

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onLogout?.();
                      onClose();
                    }}
                    className="p-1.5 rounded bg-[#1A1A1A] border border-[#333] text-[#A3A3A3] hover:text-white cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-montserrat font-bold text-xs text-white uppercase block">
                    COMPETITIVE ACCESS
                  </span>
                  <span className="text-[10px] text-[#788294] font-rajdhani block">
                    Admin & Captain Portal
                  </span>
                </div>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenLogin?.();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#E5E5E5] text-black font-mono font-bold text-[10px] uppercase cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Key className="w-3 h-3 text-black" />
                  <span>LOGIN</span>
                </button>
              </div>
            )}
          </div>

          {/* Section Navigation Links */}
          <nav className="p-3 space-y-1">
            <span className="text-[9px] font-mono uppercase text-[#737373] tracking-wider px-2 py-1 block">
              PORTAL NAVIGATION
            </span>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-montserrat transition-all ${
                    active
                      ? 'bg-[#E5C05B]/15 border border-[#E5C05B]/40 text-[#E5C05B] font-bold shadow-[0_0_10px_rgba(229,192,91,0.15)]'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#121620]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </div>

                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950 border border-red-500/40 text-red-300 font-mono font-bold">
                      {link.badge}
                    </span>
                  )}
                  {link.highlight && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E5C05B]/20 text-[#E5C05B] font-mono font-bold">
                      {link.highlight}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom Strip */}
        <div className="p-3 border-t border-[#1E2536] bg-black/50">
          <div className="text-center text-[10px] font-mono text-[#525252]">
            © {new Date().getFullYear()} Live tournaments.in • Esports Arena
          </div>
        </div>

      </div>
    </div>
  );
};

export default MobileDrawer;
