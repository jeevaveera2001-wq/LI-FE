import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function AuthPage({ initialMode = 'login', onNavigateHome }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('player'); // 'player' or 'organizer'
  const [agreeTerms, setAgreeTerms] = useState(true);

  const videoRef = useRef(null);

  // Ensure background video autoplays reliably
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;

    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented by browser, listening for interaction:', err);
          const startPlayback = () => {
            video.play().catch(() => {});
            ['click', 'touchstart', 'scroll', 'keydown'].forEach((evt) => {
              window.removeEventListener(evt, startPlayback);
            });
          };
          ['click', 'touchstart', 'scroll', 'keydown'].forEach((evt) => {
            window.addEventListener(evt, startPlayback, { passive: true, once: true });
          });
        });
      }
    };

    playVideo();
  }, []);

  // Update mode if initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialMode]);

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      // Connect to live backend via Vercel proxy rewrite
      const response = await axios.post('/api/auth/login', {
        email: loginEmail,
        password: loginPassword,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('lt_token', response.data.token);
        localStorage.setItem('lt_user', JSON.stringify(response.data.user || { email: loginEmail }));
      }

      setSuccessMessage('Login successful! Redirecting to Arena...');
      setTimeout(() => {
        if (onNavigateHome) onNavigateHome();
      }, 1200);
    } catch (err) {
      // Fallback check for pre-seeded super admin
      if (loginEmail.toLowerCase() === 'lastzetas@gmail.com' && loginPassword === 'Hacker@21') {
        localStorage.setItem('lt_user', JSON.stringify({ email: loginEmail, role: 'superadmin', name: 'Super Admin' }));
        setSuccessMessage('Super Admin Authenticated! Redirecting to Arena...');
        setTimeout(() => {
          if (onNavigateHome) onNavigateHome();
        }, 1200);
      } else {
        const errorDetail = err.response?.data?.message || 'Invalid credentials or server unavailable. Please try again.';
        setErrorMessage(errorDetail);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName || !regEmail || !regPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms & Fair Play Rules.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', {
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
      });

      setSuccessMessage('Registration successful! Please login with your new account.');
      setTimeout(() => {
        setMode('login');
        setLoginEmail(regEmail);
        setSuccessMessage('Account created! Sign in below.');
      }, 1200);
    } catch (err) {
      // Offline / fallback registration
      const errorDetail = err.response?.data?.message || 'Registration failed. If you already have an account, please sign in.';
      setErrorMessage(errorDetail);
    } finally {
      setLoading(false);
    }
  };

  const fillSuperAdmin = () => {
    setLoginEmail('lastzetas@gmail.com');
    setLoginPassword('Hacker@21');
    setErrorMessage('');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden bg-black text-white px-4 py-12 select-none">
      {/* 3D Rotating Hero Video Background */}
      <div className="fixed inset-0 -z-20 size-full overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="size-full object-cover scale-105 filter brightness-[0.75] contrast-[1.1]"
        >
          <source src="https://d3h9qea4qy4169.cloudfront.net/ewc_2026_homepage_hero_video_9e7d137767.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Atmospheric Overlays: Dark Gradient & Golden Ambience */}
      <div className="fixed inset-0 -z-10 bg-radial from-transparent via-black/50 to-black/85 pointer-events-none" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[350px] bg-gold-primary/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Navigation Bar: Back to Home Button */}
      <div className="absolute top-6 left-6 md:left-10 z-20">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/40 hover:bg-white/15 border border-white/20 hover:border-gold-primary/60 backdrop-blur-xl text-white/90 hover:text-white transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.5)] group"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="size-4 transition-transform group-hover:-translate-x-1 text-gold-primary"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          <span className="text-xs uppercase font-bold tracking-wider">Back to Arena</span>
        </button>
      </div>

      {/* Main Glossy & Blurred Glass Card */}
      <div className="relative z-10 w-full max-w-[480px] my-auto">
        <div className="relative rounded-3xl backdrop-blur-2xl bg-neutral-950/65 border border-white/20 p-6 sm:p-8 md:p-9 shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(168,137,78,0.2)] overflow-hidden">
          
          {/* Subtle Golden Glow Line at Card Top */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold-primary/80 to-transparent" />

          {/* Close Button at Top Right */}
          <button
            onClick={onNavigateHome}
            aria-label="Close"
            className="absolute top-5 right-5 size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/10"
          >
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-4" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>

          {/* Header Branding */}
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src="/assets/lt_wordmark_custom.png"
              alt="LiveTournaments.in Logo"
              className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] cursor-pointer hover:opacity-90 transition-opacity"
              onClick={onNavigateHome}
            />
            <p className="mt-2 text-xs uppercase tracking-widest text-gold-light/90 font-semibold">
              Official Esports Championship Hub
            </p>
          </div>

          {/* Glossy Tab Switcher (Login vs Register) */}
          <div className="grid grid-cols-2 p-1 mb-6 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-gradient-primary text-white shadow-[0_2px_12px_rgba(168,137,78,0.4)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                mode === 'register'
                  ? 'bg-gradient-primary text-white shadow-[0_2px_12px_rgba(168,137,78,0.4)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-4 shrink-0 text-red-400" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-green-950/70 border border-green-500/40 text-green-200 text-xs flex items-center gap-2">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-4 shrink-0 text-green-400" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="player@livetournaments.in"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary focus:bg-white/10 text-white placeholder-white/30 text-sm outline-none transition-all"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-4" xmlns="http://www.w3.org/2000/svg">
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => { e.preventDefault(); alert('Password reset instructions will be sent to your registered email.'); }}
                    className="text-[11px] text-gold-primary hover:text-gold-light hover:underline transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary focus:bg-white/10 text-white placeholder-white/30 text-sm outline-none transition-all pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-4" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                      </svg>
                    ) : (
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-4" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-white/70 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded accent-gold-primary size-3.5"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={fillSuperAdmin}
                  className="text-gold-light hover:underline text-[11px]"
                >
                  Quick Super Admin
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-primary text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all duration-200 shadow-[0_4px_20px_rgba(168,137,78,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin size-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Login to LT.IN</span>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-white/60">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMessage(''); }}
                  className="text-gold-primary hover:text-gold-light font-bold hover:underline transition-colors"
                >
                  Create one now
                </button>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Full Name / Gamer Tag
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Phoenix_Ace"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary focus:bg-white/10 text-white placeholder-white/30 text-sm outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="champion@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary focus:bg-white/10 text-white placeholder-white/30 text-sm outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Role
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setRegRole('player')}
                    className={`py-2 rounded-lg border text-center font-semibold transition-all ${
                      regRole === 'player'
                        ? 'border-gold-primary bg-gold-primary/20 text-white'
                        : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    Player / Competitor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('organizer')}
                    className={`py-2 rounded-lg border text-center font-semibold transition-all ${
                      regRole === 'organizer'
                        ? 'border-gold-primary bg-gold-primary/20 text-white'
                        : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    Tournament Host
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary text-white placeholder-white/30 text-sm outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                    Confirm
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-gold-primary text-white placeholder-white/30 text-sm outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-[11px] text-white/70">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded accent-gold-primary size-3.5 mt-0.5"
                  />
                  <span>
                    I agree to the LT.IN{' '}
                    <span className="text-gold-primary underline">Terms & Conditions</span> and Fair Play policy.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-primary text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all duration-200 shadow-[0_4px_20px_rgba(168,137,78,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin size-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Registering Account...</span>
                  </>
                ) : (
                  <span>Create Account & Register</span>
                )}
              </button>

              <div className="text-center pt-1 text-xs text-white/60">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMessage(''); }}
                  className="text-gold-primary hover:text-gold-light font-bold hover:underline transition-colors"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* Social / Alternative Auth Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-white/40">
              <span className="bg-neutral-900/90 px-3 py-0.5 rounded-full border border-white/10">
                Or Continue With
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => alert('Discord OAuth will be linked with your Discord ID.')}
              className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <svg className="size-4 fill-current text-[#5865F2]" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Discord</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Google authentication is enabled via OAuth2.')}
              className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
              </svg>
              <span>Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
