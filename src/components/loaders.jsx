import React, { useState, useEffect } from 'react';

/**
 * =====================================================================
 * LIVETOURNAMENTS OFFICIAL ESPORTS LOADER SUITE
 * 8 Dedicated Loaders matching the home screen aesthetics:
 * #DFBD78 Gold, #0E0E10 Dark, Esports Crest, Shimmering Gold Waves
 * =====================================================================
 */

// 1. SPINNER LOADER (Esports Gold Ring with LT Emblem)
export function SpinnerLoader({ size = 'md', text = '', crest = true, className = '' }) {
  const sizeMap = {
    sm: { box: 'size-6', ring: 'size-6 border-2', text: 'text-[10px]', crestSize: 'text-[8px]' },
    md: { box: 'size-10', ring: 'size-10 border-[3px]', text: 'text-xs', crestSize: 'text-[10px]' },
    lg: { box: 'size-16', ring: 'size-16 border-4', text: 'text-sm', crestSize: 'text-xs font-black' },
    xl: { box: 'size-24', ring: 'size-24 border-[5px]', text: 'text-base font-bold', crestSize: 'text-sm font-black' }
  };
  const config = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className={`relative flex items-center justify-center ${config.box}`}>
        {/* Outer glowing ambient halo */}
        <div className="absolute inset-0 rounded-full bg-gold-primary/20 blur-md animate-pulse"></div>
        
        {/* Spinning Gold Arc Ring */}
        <div
          className={`absolute inset-0 rounded-full border-t-[#DFBD78] border-r-transparent border-b-[#DFBD78]/30 border-l-transparent animate-lt-spin ${config.ring}`}
        ></div>

        {/* Counter-rotating secondary accent track */}
        <div
          style={{ animationDirection: 'reverse', animationDuration: '1.4s' }}
          className={`absolute inset-1 rounded-full border-t-transparent border-r-[#DFBD78]/50 border-b-transparent border-l-[#DFBD78]/20 animate-lt-spin border`}
        ></div>

        {/* Center LT Emblem */}
        {crest && (
          <div className={`font-mono text-[#DFBD78] tracking-tighter select-none font-extrabold ${config.crestSize}`}>
            LT
          </div>
        )}
      </div>

      {text && (
        <span className={`font-mono uppercase tracking-widest text-gold-primary/90 font-bold ${config.text}`}>
          {text}
        </span>
      )}
    </div>
  );
}

// 2. SKELETON LOADER (Shimmering Tournament Card, Rows & Blocks)
export function SkeletonLoader({ variant = 'tournament-card', count = 1, className = '' }) {
  const renderItem = (index) => {
    switch (variant) {
      case 'tournament-card':
        return (
          <div
            key={index}
            className="flex flex-col rounded-2xl bg-white border border-black/10 overflow-hidden shadow-sm"
          >
            {/* Image Banner Skeleton */}
            <div className="relative aspect-[1.74/1] w-full bg-neutral-200 animate-lt-shimmer">
              <div className="absolute top-3 left-3 w-28 h-5 rounded bg-neutral-300"></div>
              <div className="absolute bottom-3 right-3 w-32 h-5 rounded bg-neutral-300"></div>
            </div>

            {/* Content Details Skeleton */}
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-24 h-3 rounded bg-neutral-200 animate-lt-shimmer"></div>
                <div className="w-16 h-4 rounded bg-neutral-200 animate-lt-shimmer"></div>
              </div>
              <div className="w-3/4 h-5 rounded bg-neutral-300 animate-lt-shimmer"></div>
              <div className="w-full h-3 rounded bg-neutral-200 animate-lt-shimmer"></div>
              <div className="w-2/3 h-3 rounded bg-neutral-200 animate-lt-shimmer"></div>

              {/* Specs Divider */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                <div className="w-28 h-3 rounded bg-neutral-200 animate-lt-shimmer"></div>
                <div className="w-20 h-3 rounded bg-neutral-200 animate-lt-shimmer"></div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="w-14 h-2.5 rounded bg-neutral-200"></div>
                  <div className="w-24 h-4 rounded bg-neutral-300 animate-lt-shimmer"></div>
                </div>
                <div className="w-28 h-8 rounded-lg bg-neutral-300 animate-lt-shimmer"></div>
              </div>
            </div>
          </div>
        );

      case 'table-row':
        return (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white border-b border-gray-100 animate-lt-shimmer"
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-neutral-200"></div>
              <div className="flex flex-col gap-1.5">
                <div className="w-32 h-3.5 rounded bg-neutral-300"></div>
                <div className="w-20 h-2.5 rounded bg-neutral-200"></div>
              </div>
            </div>
            <div className="w-24 h-5 rounded-full bg-neutral-200"></div>
            <div className="w-16 h-3.5 rounded bg-neutral-200"></div>
            <div className="w-20 h-7 rounded-md bg-neutral-300"></div>
          </div>
        );

      case 'card':
      default:
        return (
          <div
            key={index}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col gap-3 animate-lt-shimmer"
          >
            <div className="w-1/3 h-4 rounded bg-neutral-300"></div>
            <div className="w-full h-3 rounded bg-neutral-200"></div>
            <div className="w-5/6 h-3 rounded bg-neutral-200"></div>
            <div className="w-24 h-8 rounded-lg bg-neutral-300 mt-2"></div>
          </div>
        );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {variant === 'tournament-card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {Array.from({ length: count }).map((_, i) => renderItem(i))}
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => renderItem(i))}
        </div>
      )}
    </div>
  );
}

// 3. PROGRESS BAR LOADER (Top Viewport Sticky Bar & In-Page Bar)
export function TopProgressBar({ active = false, progress = 0 }) {
  if (!active && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[9999] bg-black/40 overflow-hidden pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[#C5A059] via-[#DFBD78] to-[#FFF0C8] shadow-[0_0_12px_#DFBD78] transition-all duration-300 ease-out"
        style={{
          width: progress > 0 ? `${progress}%` : '100%',
          animation: progress === 0 ? 'lt-progress-indeterminate 1.5s infinite linear' : 'none'
        }}
      ></div>
    </div>
  );
}

export function ProgressBar({ progress = 65, label = 'Match Verification Status', className = '' }) {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="font-bold text-gray-800 uppercase tracking-wider">{label}</span>
        <span className="font-extrabold text-[#DFBD78]">{progress}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden relative shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#C5A059] via-[#DFBD78] to-[#F6E3BA] shadow-[0_0_8px_rgba(223,189,120,0.6)] transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        ></div>
      </div>
    </div>
  );
}

// 4. PULSING LOADER (Esports Radar Sonar Pulse)
export function PulsingLoader({ size = 'md', text = 'VERIFYING MATCH TELEMETRY...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative flex items-center justify-center size-20">
        {/* Concentric radar rings */}
        <div className="absolute inset-0 rounded-full border border-gold-primary/70 animate-lt-radar"></div>
        <div
          style={{ animationDelay: '0.7s' }}
          className="absolute inset-0 rounded-full border border-gold-primary/50 animate-lt-radar"
        ></div>
        <div
          style={{ animationDelay: '1.4s' }}
          className="absolute inset-0 rounded-full border border-gold-primary/30 animate-lt-radar"
        ></div>

        {/* Center glowing badge */}
        <div className="relative z-10 size-12 rounded-full bg-[#0E0E10] border-2 border-gold-primary shadow-[0_0_15px_#DFBD78] flex items-center justify-center animate-lt-pulse">
          <span className="font-mono text-gold-primary font-black text-sm tracking-tight">LT</span>
        </div>
      </div>

      {text && (
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-gold-primary animate-ping"></span>
          <span className="font-mono text-xs uppercase tracking-widest font-extrabold text-gold-primary">
            {text}
          </span>
        </div>
      )}
    </div>
  );
}

// 5. BUTTON LOADER (Loading Button with Interactive States)
export function ButtonLoader({
  loading = false,
  children,
  loadingText = 'Processing...',
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'dark'
  className = '',
  disabled = false,
  type = 'button'
}) {
  const variantStyles = {
    primary: 'bg-black hover:bg-gold-primary text-white hover:text-black border-transparent',
    gold: 'bg-gold-primary hover:bg-gold-light text-black border-transparent',
    dark: 'bg-[#18181B] hover:bg-[#222226] text-white border-white/10',
    outline: 'bg-transparent border border-gold-primary text-gold-primary hover:bg-gold-primary/10'
  };

  const styleClass = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      onClick={!loading && !disabled ? onClick : undefined}
      disabled={loading || disabled}
      className={`relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 shadow-sm ${styleClass} ${className}`}
    >
      {loading ? (
        <>
          <div className="size-3.5 rounded-full border-2 border-current border-t-transparent animate-lt-spin"></div>
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

// 6. FULL SCREEN LOADER (Immersive Esports Loading Overlay)
export function FullScreenLoader({
  isOpen = false,
  title = 'LIVETOURNAMENTS ARENA',
  subtitle = 'Connecting to official match engine & anti-cheat telemetry...',
  onClose = null
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] backdrop-blur-md bg-black/85 flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in">
      <div className="relative flex flex-col items-center max-w-sm w-full bg-[#0E0E10] border border-gold-primary/40 rounded-3xl p-8 shadow-2xl">
        {/* Ambient Top Glow */}
        <div className="absolute -top-10 size-40 bg-gold-primary/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Outer Rotating Shield */}
        <div className="relative size-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-gold-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-gold-primary animate-lt-spin"></div>
          <div
            style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
            className="absolute inset-2 rounded-full border-b-2 border-[#DFBD78]/60 animate-lt-spin"
          ></div>

          {/* Golden Center Crest */}
          <div className="size-14 rounded-2xl bg-gradient-to-br from-[#1E1911] to-[#0E0E10] border border-gold-primary flex flex-col items-center justify-center shadow-[0_0_20px_rgba(223,189,120,0.5)] animate-lt-pulse">
            <span className="material-symbols-outlined text-gold-primary text-2xl">trophy</span>
          </div>
        </div>

        {/* Title & Brand */}
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#DFBD78] uppercase mb-1">
          {title}
        </span>
        <h3 className="text-xl font-black text-white tracking-tight uppercase mb-3">
          Loading Arena
        </h3>

        {/* Animated Subtitle / Status */}
        <p className="text-xs text-gray-300 font-medium leading-relaxed mb-6 font-mono">
          {subtitle}
        </p>

        {/* Progress Track */}
        <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden relative mb-4">
          <div className="h-full rounded-full bg-gradient-to-r from-gold-primary via-gold-light to-gold-primary shadow-[0_0_10px_#DFBD78] animate-lt-shimmer"></div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-[11px] text-gray-400 hover:text-white uppercase font-bold tracking-wider cursor-pointer underline mt-2"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

// 7. PULL TO REFRESH LOADER (Mobile/Touch & Interactive Pull Trigger)
export function PullToRefreshLoader({
  onRefresh,
  isRefreshing = false,
  children
}) {
  const [pullY, setPullY] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const threshold = 70;

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!isPulling) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0 && window.scrollY === 0) {
      setPullY(Math.min(diff * 0.45, 90));
    }
  };

  const handleTouchEnd = () => {
    if (pullY >= threshold && onRefresh) {
      onRefresh();
    }
    setPullY(0);
    setIsPulling(false);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full"
    >
      {/* Pull Indicator Pill */}
      <div
        style={{
          transform: `translateY(${pullY > 0 || isRefreshing ? '0px' : '-60px'})`,
          opacity: pullY > 10 || isRefreshing ? 1 : 0
        }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-200 pointer-events-none"
      >
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0E0E10] border border-gold-primary/60 text-white shadow-xl">
          {isRefreshing ? (
            <>
              <div className="size-4 rounded-full border-2 border-gold-primary border-t-transparent animate-lt-spin"></div>
              <span className="text-[11px] font-mono font-bold text-gold-primary uppercase tracking-wider">
                Refreshing Arena...
              </span>
            </>
          ) : (
            <>
              <span
                style={{ transform: `rotate(${Math.min(pullY * 3, 180)}deg)` }}
                className="material-symbols-outlined text-[16px] text-gold-primary transition-transform"
              >
                arrow_downward
              </span>
              <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                {pullY >= threshold ? 'Release to Refresh' : 'Pull to Refresh'}
              </span>
            </>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}

// 8. INFINITE SCROLL LOADER (Feed Bottom Pagination Loader)
export function InfiniteScrollLoader({
  loading = false,
  hasMore = true,
  onLoadMore = null,
  label = 'Loading more official tournaments & scrims...'
}) {
  return (
    <div className="w-full py-8 flex flex-col items-center justify-center gap-3">
      {loading ? (
        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/80 border border-gray-200 shadow-sm backdrop-blur-sm">
          {/* 3 Bouncing Hex Gold Dots */}
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-gold-primary animate-bounce [animation-delay:-0.3s]"></span>
            <span className="size-2.5 rounded-full bg-[#C5A059] animate-bounce [animation-delay:-0.15s]"></span>
            <span className="size-2.5 rounded-full bg-gold-light animate-bounce"></span>
          </div>

          <span className="font-mono text-xs font-bold text-gray-700 uppercase tracking-wider">
            {label}
          </span>
        </div>
      ) : hasMore && onLoadMore ? (
        <button
          onClick={onLoadMore}
          className="px-6 py-2.5 rounded-xl bg-black hover:bg-gold-primary text-white hover:text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <span>Load More Tournaments</span>
          <span className="material-symbols-outlined text-[16px]">expand_more</span>
        </button>
      ) : (
        <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-widest">
          ✓ All Official Tournaments Loaded
        </span>
      )}
    </div>
  );
}

// ========================================================
// INTERACTIVE LOADERS SHOWCASE MODAL
// Lets the user preview and test all 8 loaders side-by-side
// ========================================================
export function LoadersShowcaseModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('all');
  const [testButtonLoading, setTestButtonLoading] = useState(false);
  const [testFullScreen, setTestFullScreen] = useState(false);
  const [testProgressBar, setTestProgressBar] = useState(false);
  const [testProgressVal, setTestProgressVal] = useState(45);
  const [testRefreshing, setTestRefreshing] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#0E0E10] border border-gold-primary/40 rounded-3xl p-6 md:p-8 text-white shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#1E1911] border border-gold-primary flex items-center justify-center text-gold-primary">
              <span className="material-symbols-outlined text-2xl">hourglass_top</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-gold-primary font-bold uppercase tracking-widest block">
                Official UI Suite
              </span>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                All 8 LiveTournaments Loaders
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Interactive Controls & Trigger Pills */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Spinner Loader */}
          <div className="bg-[#18181B] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-between text-center gap-4">
            <span className="text-[11px] font-mono font-bold text-gold-primary uppercase">
              1. Spinner Loader
            </span>
            <SpinnerLoader size="lg" text="Loading Match..." />
            <span className="text-[10px] text-gray-400">Esports Dual-Ring + LT Emblem</span>
          </div>

          {/* 2. Pulsing Loader */}
          <div className="bg-[#18181B] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-between text-center gap-4">
            <span className="text-[11px] font-mono font-bold text-gold-primary uppercase">
              2. Pulsing Loader
            </span>
            <PulsingLoader text="Syncing Roster..." />
            <span className="text-[10px] text-gray-400">Concentric Radar Pulse</span>
          </div>

          {/* 3. Progress Bar */}
          <div className="bg-[#18181B] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-between text-center gap-4">
            <span className="text-[11px] font-mono font-bold text-gold-primary uppercase">
              3. Progress Bar
            </span>
            <div className="w-full">
              <ProgressBar progress={testProgressVal} label="Slot Fill Ratio" />
              <div className="flex gap-2 mt-3 justify-center">
                <button
                  onClick={() => setTestProgressVal((p) => Math.max(0, p - 20))}
                  className="px-2 py-1 rounded bg-white/10 text-[10px] font-bold"
                >
                  -20%
                </button>
                <button
                  onClick={() => setTestProgressVal((p) => Math.min(100, p + 20))}
                  className="px-2 py-1 rounded bg-gold-primary text-black text-[10px] font-bold"
                >
                  +20%
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setTestProgressBar(true);
                setTimeout(() => setTestProgressBar(false), 2500);
              }}
              className="px-3 py-1.5 rounded-lg bg-gold-primary/20 text-gold-primary text-[10px] font-bold hover:bg-gold-primary/30"
            >
              Test Top Bar (2.5s)
            </button>
          </div>

          {/* 4. Button Loader */}
          <div className="bg-[#18181B] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-between text-center gap-4">
            <span className="text-[11px] font-mono font-bold text-gold-primary uppercase">
              4. Button Loader
            </span>
            <div className="w-full flex flex-col gap-2">
              <ButtonLoader
                loading={testButtonLoading}
                loadingText="Securing Slot..."
                onClick={() => {
                  setTestButtonLoading(true);
                  setTimeout(() => setTestButtonLoading(false), 2000);
                }}
                className="w-full !bg-gold-primary !text-black"
              >
                Register Match
              </ButtonLoader>
              <span className="text-[10px] text-gray-400">Click button to trigger</span>
            </div>
            <span className="text-[10px] text-gray-500">Embedded Micro-Spinner</span>
          </div>

          {/* 5. Full Screen Loader */}
          <div className="bg-[#18181B] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-between text-center gap-4">
            <span className="text-[11px] font-mono font-bold text-gold-primary uppercase">
              5. Full Screen Loader
            </span>
            <span className="material-symbols-outlined text-4xl text-gold-primary">fullscreen</span>
            <button
              onClick={() => {
                setTestFullScreen(true);
                setTimeout(() => setTestFullScreen(false), 3000);
              }}
              className="w-full px-4 py-2 rounded-xl bg-gold-primary text-black font-extrabold text-xs uppercase tracking-wider"
            >
              Preview Full Screen (3s)
            </button>
            <span className="text-[10px] text-gray-400">Backdrop Blur + Dual Shield</span>
          </div>

          {/* 6. Pull to Refresh Loader */}
          <div className="bg-[#18181B] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-between text-center gap-4">
            <span className="text-[11px] font-mono font-bold text-gold-primary uppercase">
              6. Pull to Refresh
            </span>
            <span className="material-symbols-outlined text-4xl text-blue-400">refresh</span>
            <button
              onClick={() => {
                setTestRefreshing(true);
                setTimeout(() => setTestRefreshing(false), 2500);
              }}
              className="w-full px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider"
            >
              {testRefreshing ? 'Refreshing...' : 'Trigger Pull Refresh'}
            </button>
            <span className="text-[10px] text-gray-400">Touch Drag & Mobile Spring</span>
          </div>

          {/* 7. Infinite Scroll Loader */}
          <div className="bg-[#18181B] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-between text-center gap-4 col-span-1 md:col-span-2">
            <span className="text-[11px] font-mono font-bold text-gold-primary uppercase">
              7. Infinite Scroll Loader
            </span>
            <div className="w-full bg-black/40 rounded-xl p-3 border border-white/5">
              <InfiniteScrollLoader loading={true} label="Loading Tournament Bracket Feed..." />
            </div>
            <span className="text-[10px] text-gray-400">Staggered Bouncing Gold Hex Dots</span>
          </div>
        </div>

        {/* 8. Skeleton Loader Preview Banner */}
        <div className="bg-[#18181B] border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-gold-primary uppercase">
              8. Skeleton Loader (Exact Tournament Card Geometry)
            </span>
            <span className="text-[10px] text-gray-400">Shimmering Gold Wave Effect</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SkeletonLoader variant="tournament-card" count={3} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-[11px] text-gray-400 font-mono">
            LiveTournaments.in &bull; Production Loader Architecture
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gold-primary hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer"
          >
            Close Suite
          </button>
        </div>

      </div>

      {/* Embedded FullScreen and TopBar tester */}
      <TopProgressBar active={testProgressBar} />
      <FullScreenLoader
        isOpen={testFullScreen}
        title="LIVETOURNAMENTS ARENA"
        subtitle="Verifying tournament brackets, anti-cheat, and custom rooms..."
        onClose={() => setTestFullScreen(false)}
      />
    </div>
  );
}

// Backwards compatibility aliases for dashboard components
export function SkeletonCard() {
  return <SkeletonLoader variant="card" count={1} />;
}

export function SkeletonChart({ title = 'Chart', height = 'h-56' }) {
  return (
    <div className={`p-4 bg-white rounded-2xl border border-gray-100 ${height} flex flex-col justify-between animate-lt-shimmer`}>
      <div className="w-1/3 h-4 rounded bg-neutral-200"></div>
      <div className="w-full h-32 rounded bg-neutral-100 flex items-center justify-center">
        <span className="text-xs text-gray-400 font-mono">{title}</span>
      </div>
    </div>
  );
}

export const PullToRefresh = PullToRefreshLoader;

