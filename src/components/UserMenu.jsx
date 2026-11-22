import React, { useState, useEffect, useRef } from 'react';

export default function UserMenu({ currentUser, onNavigate, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (target) => {
    setIsOpen(false);
    if (target === 'tournaments') {
      if (onNavigate) onNavigate('tournaments');
      return;
    }
    if (target === 'host') {
      if (onNavigate) onNavigate('home', 'host-tournaments-section');
      return;
    }
    if (onNavigate) onNavigate(target);
  };

  if (!currentUser) {
    return (
      <div
        style={{ position: 'fixed', top: '20px', right: '20px', left: 'auto', zIndex: 100 }}
        className="flex items-center gap-2"
      >
        <button
          onClick={() => onNavigate && onNavigate('login')}
          className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-white/15 border border-white/20 hover:border-gold-primary/60 backdrop-blur-xl text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg cursor-pointer"
        >
          Sign In
        </button>
        <button
          onClick={() => onNavigate && onNavigate('register')}
          className="px-3.5 py-1.5 rounded-full bg-gradient-primary hover:brightness-110 border border-gold-primary/40 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_2px_12px_rgba(168,137,78,0.4)] cursor-pointer"
        >
          Register
        </button>
      </div>
    );
  }

  const isSuperAdmin = currentUser.role === 'superadmin' || currentUser.role === 'admin' || currentUser.email === 'superadmin@lt.in' || currentUser.email === 'admin@lt.in';
  const displayName = currentUser.name || currentUser.username || (isSuperAdmin ? 'Admin' : 'User');

  return (
    <div
      ref={menuRef}
      style={{ position: 'fixed', top: '20px', right: '20px', left: 'auto', zIndex: 100 }}
      className="select-none"
    >
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full backdrop-blur-xl transition-all duration-200 shadow-xl cursor-pointer ${
          isSuperAdmin
            ? 'bg-neutral-950/85 border border-gold-primary/80 text-gold-light hover:border-gold-primary shadow-[0_0_15px_rgba(168,137,78,0.3)]'
            : 'bg-neutral-950/85 border border-white/20 text-white hover:border-gold-primary/60'
        }`}
      >
        <div className={`size-6 rounded-full flex items-center justify-center text-xs font-black ${
          isSuperAdmin ? 'bg-gold-primary text-black' : 'bg-white/20 text-white'
        }`}>
          {isSuperAdmin ? '👑' : '👤'}
        </div>

        <div className="flex flex-col text-left">
          <span className="text-xs font-bold leading-tight truncate max-w-[120px] sm:max-w-[160px]">
            {displayName}
          </span>
          <span className={`text-[9px] font-black uppercase tracking-wider ${
            isSuperAdmin ? 'text-gold-light' : 'text-white/50'
          }`}>
            {isSuperAdmin ? 'Admin' : 'User Menu'}
          </span>
        </div>

        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          className={`size-3.5 transition-transform duration-200 text-gold-primary ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {/* Glossy Dropdown Menu */}
      {isOpen && (
        <div
          style={{ position: 'absolute', top: '100%', right: '0', left: 'auto', marginTop: '8px', width: '260px' }}
          className="rounded-2xl bg-neutral-950/95 border border-gold-primary/40 backdrop-blur-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(168,137,78,0.2)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header Card in Dropdown */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-2">
            <div className="text-xs font-bold text-white truncate">{displayName}</div>
            <div className="text-[10px] text-white/50 truncate mt-0.5">{currentUser.email}</div>
            <div className="mt-2 flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                isSuperAdmin
                  ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}>
                Role: {currentUser.role === 'superadmin' ? 'admin' : (currentUser.role || 'user')}
              </span>
              <span className="text-[9px] text-green-400 font-semibold flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-green-400"></span>
                Active
              </span>
            </div>
          </div>

          {/* Menu Options for ADMIN */}
          {isSuperAdmin ? (
            <div className="space-y-1 text-xs">
              <button
                onClick={() => handleNav('admin-dashboard')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gold-light hover:bg-gold-primary/20 transition-colors font-bold text-left cursor-pointer"
              >
                <span>⚡</span>
                <span>Admin Dashboard</span>
              </button>

              <button
                onClick={() => handleNav('home')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer"
              >
                <span>🌐</span>
                <span>Home Arena View</span>
              </button>

              <button
                onClick={() => { setIsOpen(false); if (onNavigate) onNavigate('home', 'contact-us'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer"
              >
                <span>✉️</span>
                <span>Contact Us</span>
              </button>
            </div>
          ) : (
            /* Menu Options for NORMAL USER */
            <div className="space-y-1 text-xs">
              <button
                onClick={() => handleNav('user-dashboard')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gold-primary/10 hover:bg-gold-primary/20 text-gold-light border border-gold-primary/30 transition-colors font-bold text-left cursor-pointer"
              >
                <span>📊</span>
                <span>My Dashboard</span>
              </button>

              <button
                onClick={() => handleNav('tournaments')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer"
              >
                <span>🏆</span>
                <span>Tournaments</span>
              </button>

              <button
                onClick={() => handleNav('host')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer"
              >
                <span>⚔️</span>
                <span>Host Tournament</span>
              </button>

              <button
                onClick={() => handleNav('user-dashboard')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer"
              >
                <span>👤</span>
                <span>My Profile & Squad</span>
              </button>

              <button
                onClick={() => { setIsOpen(false); if (onNavigate) onNavigate('home', 'contact-us'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer"
              >
                <span>✉️</span>
                <span>Contact Us</span>
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="my-1.5 h-[1px] bg-white/10" />

          {/* Logout */}
          <button
            onClick={() => { setIsOpen(false); if (onLogout) onLogout(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-300 hover:bg-red-950/60 hover:text-red-200 transition-colors text-xs font-bold text-left cursor-pointer"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
